import { NextResponse } from 'next/server';

interface NotificationPayload {
  userId: string;
  type: 'achievement' | 'reminder' | 'progress' | 'safety' | 'ai_insight' | 'subscription';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('in_app' | 'email' | 'sms' | 'push')[];
  scheduled_for?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface SMSTemplate {
  message: string;
}

export async function POST(req: Request) {
  try {
    const notification: NotificationPayload = await req.json();
    const { type, userId, channels } = notification;

    // Send notifications through specified channels
    const results = [];

    for (const channel of channels) {
      try {
        let result;
        switch (channel) {
          case 'in_app':
            result = await sendInAppNotification(notification);
            break;
          case 'email':
            result = await sendEmailNotification(notification);
            break;
          case 'sms':
            result = await sendSMSNotification(notification);
            break;
          case 'push':
            result = await sendPushNotification(notification);
            break;
          default:
            throw new Error(`Unsupported channel: ${channel}`);
        }
        results.push({ channel, success: true, result });
      } catch (error) {
        console.error(`Failed to send ${channel} notification:`, error);
        results.push({ channel, success: false, error: error.message });
      }
    }

    // Log notification for analytics
    await logNotificationForAnalytics(notification, results);

    return NextResponse.json({
      success: true,
      notification_id: generateNotificationId(),
      results,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

async function sendInAppNotification(notification: NotificationPayload) {
  // Store in-app notification (would use Raindrop SmartMemory in production)
  const inAppNotification = {
    id: generateNotificationId(),
    user_id: notification.userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    priority: notification.priority,
    read: false,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  // Store notification using Raindrop SmartMemory
  const response = await fetch(`${process.env.RAINDROP_ENDPOINT}/smartmemory/write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RAINDROP_API_KEY}`,
    },
    body: JSON.stringify({
      command: 'smartmemory.write',
      input: {
        key: `notification:${inAppNotification.user_id}:${inAppNotification.id}`,
        value: inAppNotification,
        ttl: 2592000 // 30 days
      }
    })
  });

  return { stored: true, notification_id: inAppNotification.id };
}

async function sendEmailNotification(notification: NotificationPayload) {
  const template = generateEmailTemplate(notification);
  
  // Use Vultr email service or integrate with EmailJS/SendGrid
  const emailResponse = await fetch('https://api.vultr.com/v2/instances', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'send_email',
      to: await getUserEmail(notification.userId),
      template: template,
      priority: notification.priority
    })
  });

  return { email_sent: true, message_id: generateNotificationId() };
}

async function sendSMSNotification(notification: NotificationPayload) {
  const template = generateSMSTemplate(notification);
  
  // Use Vultr SMS service
  const smsResponse = await fetch('https://api.vultr.com/v2/instances', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'send_sms',
      to: await getUserPhone(notification.userId),
      message: template.message,
      priority: notification.priority === 'urgent' ? 'high' : 'normal'
    })
  });

  return { sms_sent: true, message_id: generateNotificationId() };
}

async function sendPushNotification(notification: NotificationPayload) {
  // Implement push notification using web-push or Firebase
  const userSubscription = await getUserPushSubscription(notification.userId);
  
  if (!userSubscription) {
    throw new Error('No push subscription found for user');
  }

  const pushPayload = {
    title: notification.title,
    body: notification.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: `notification-${notification.type}`,
    data: notification.data,
    requireInteraction: notification.priority === 'urgent',
    actions: generateNotificationActions(notification.type)
  };

  const response = await fetch(userSubscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'TTL': '86400', // 24 hours
    },
    body: JSON.stringify({
      notification: pushPayload
    })
  });

  return { push_sent: true, message_id: generateNotificationId() };
}

function generateEmailTemplate(notification: NotificationPayload): EmailTemplate {
  const emailTemplates = {
    achievement: {
      subject: `🎉 Achievement Unlocked: ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
            <h2 style="color: white; margin: 10px 0;">${notification.title}</h2>
          </div>
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; line-height: 1.6;">${notification.message}</p>
            ${notification.data ? `
              <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 5px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">Achievement Details:</h3>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto;">${JSON.stringify(notification.data, null, 2)}</pre>
              </div>
            ` : ''}
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Your Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
      text: `🎉 Achievement: ${notification.title}\n\n${notification.message}\n\nView your dashboard: ${process.env.NEXTAUTH_URL}/dashboard`
    },
    
    reminder: {
      subject: `📚 Reminder: ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📚 Learning Reminder</h1>
            <h2 style="color: white; margin: 10px 0;">${notification.title}</h2>
          </div>
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <p style="font-size: 16px; line-height: 1.6;">${notification.message}</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Start Learning
              </a>
            </div>
          </div>
        </div>
      `,
      text: `📚 Reminder: ${notification.title}\n\n${notification.message}\n\nStart learning: ${process.env.NEXTAUTH_URL}/dashboard`
    },
    
    safety: {
      subject: `🛡️ Important Safety Update: ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f44336; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🛡️ Safety Alert</h1>
            <h2 style="color: white; margin: 10px 0;">${notification.title}</h2>
          </div>
          <div style="padding: 30px; background: #ffebee; border-radius: 0 0 10px 10px; border: 1px solid #f44336;">
            <p style="font-size: 16px; line-height: 1.6; color: #c62828;"><strong>Important:</strong> ${notification.message}</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXTAUTH_URL}/safety" style="background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Review Safety Rules
              </a>
            </div>
          </div>
        </div>
      `,
      text: `🛡️ Safety Alert: ${notification.title}\n\nIMPORTANT: ${notification.message}\n\nReview safety rules: ${process.env.NEXTAUTH_URL}/safety`
    },
    
    progress: {
      subject: `📈 Progress Update: ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2196F3; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📈 Progress Update</h1>
            <h2 style="color: white; margin: 10px 0;">${notification.title}</h2>
          </div>
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #2196F3;">
            <p style="font-size: 16px; line-height: 1.6;">${notification.message}</p>
            ${notification.data?.progress_percentage ? `
              <div style="margin: 20px 0; text-align: center;">
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
                  <div style="background: #2196F3; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: #4CAF50; height: 100%; width: ${notification.data.progress_percentage}%"></div>
                  </div>
                  <p style="margin: 10px 0 0 0; font-weight: bold;">${notification.data.progress_percentage}% Complete</p>
                </div>
              </div>
            ` : ''}
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                View Progress
              </a>
            </div>
          </div>
        </div>
      `,
      text: `📈 Progress Update: ${notification.title}\n\n${notification.message}\n\nView your progress: ${process.env.NEXTAUTH_URL}/dashboard`
    }
  };

  return emailTemplates[notification.type as keyof typeof emailTemplates] || emailTemplates.progress;
}

function generateSMSTemplate(notification: NotificationPayload): SMSTemplate {
  const maxLength = 160;
  let message = '';
  
  switch (notification.type) {
    case 'achievement':
      message = `🎉 ${notification.title}: ${notification.message.substring(0, 100)}`;
      break;
    case 'reminder':
      message = `📚 ${notification.title}: ${notification.message.substring(0, 100)}`;
      break;
    case 'safety':
      message = `🛡️ URGENT: ${notification.title} - ${notification.message.substring(0, 80)}`;
      break;
    case 'progress':
      message = `📈 ${notification.title}: ${notification.message.substring(0, 100)}`;
      break;
    default:
      message = `${notification.title}: ${notification.message.substring(0, 120)}`;
  }

  if (message.length > maxLength) {
    message = message.substring(0, maxLength - 3) + '...';
  }

  return { message: `${message} - ${process.env.NEXTAUTH_URL}` };
}

function generateNotificationActions(type: string) {
  const actions = {
    achievement: [
      { action: 'view', title: 'View Achievement' },
      { action: 'share', title: 'Share' }
    ],
    reminder: [
      { action: 'start', title: 'Start Now' },
      { action: 'snooze', title: 'Later' }
    ],
    safety: [
      { action: 'review', title: 'Review Safety' },
      { action: 'emergency', title: 'Get Help' }
    ],
    progress: [
      { action: 'view', title: 'View Progress' },
      { action: 'share', title: 'Share' }
    ]
  };

  return actions[type as keyof typeof actions] || actions.progress;
}

// Helper functions
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getUserEmail(userId: string): Promise<string> {
  // Get user email from database or Raindrop SmartMemory
  return `user${userId}@example.com`; // Placeholder
}

async function getUserPhone(userId: string): Promise<string> {
  // Get user phone from database or Raindrop SmartMemory
  return '+1234567890'; // Placeholder
}

async function getUserPushSubscription(userId: string) {
  // Get user push subscription from database
  return {
    endpoint: 'https://fcm.googleapis.com/fcm/send/example-token',
    keys: {
      p256dh: 'example-key',
      auth: 'example-auth'
    }
  };
}

async function logNotificationForAnalytics(notification: NotificationPayload, results: any[]) {
  try {
    // Log notification event for analytics using Raindrop SmartBucket
    await fetch(`${process.env.RAINDROP_ENDPOINT}/smartbucket.create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RAINDROP_API_KEY}`,
      },
      body: JSON.stringify({
        command: 'smartbucket.create',
        input: {
          bucket: 'notifications',
          data: {
            notification_id: generateNotificationId(),
            user_id: notification.userId,
            type: notification.type,
            channels: notification.channels,
            priority: notification.priority,
            results: results,
            timestamp: new Date().toISOString()
          }
        }
      })
    });
  } catch (error) {
    console.error('Failed to log notification for analytics:', error);
  }
}