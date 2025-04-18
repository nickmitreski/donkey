'use server'

// Make sure this URL is correct and the webhook is set up in n8n
const N8N_WEBHOOK_URL = 'https://primary-production-26324.up.railway.app/webhook-test/55b6bcf5-21f7-4694-af80-ca870c2bbbd4'

export async function analyzeConversation(message) {
  try {
    // Check for task-related keywords in the message
    const taskTypes = {
      email: /(read|send|check|delete|forward|reply to|show|get|fetch|look at|view|open|last|recent|new|peek|take a look|look into) (email|emails|mail|inbox|message|messages)/i,
      calendar: /(schedule|add|create|delete|update|check|show|get|view|look at|open|next|upcoming|last|recent) (event|meeting|appointment|calendar|schedule)/i,
      search: /(search|find|look up|google|wikipedia|search for|find information about|look for|get information about) (for|about|on|regarding)/i,
      todo: /(add|create|delete|update|complete|check|show|get|view|look at|open|list|show me|what are) (todo|task|reminder|tasks|todos|reminders)/i
    }

    // Determine if the message contains any task requests
    for (const [taskType, pattern] of Object.entries(taskTypes)) {
      if (pattern.test(message)) {
        console.log(`Task detected: ${taskType} - "${message}"`);
        
        try {
          // Create URL parameters
          const params = new URLSearchParams({
            taskType,
            message,
            timestamp: new Date().toISOString()
          }).toString();

          // Send the request to n8n webhook using GET
          const response = await fetch(`${N8N_WEBHOOK_URL}?${params}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });

          let webhookResponse = null;
          try {
            webhookResponse = await response.json();
          } catch (e) {
            console.error('Failed to parse webhook response:', e);
          }

          if (!response.ok) {
            console.error(`n8n webhook error: ${response.status} ${response.statusText}`);
            return {
              isTask: true,
              taskType,
              message,
              webhookStatus: 'failed',
              error: `Webhook error (${response.status})`,
              webhookResponse
            };
          }

          return {
            isTask: true,
            taskType,
            message,
            webhookStatus: 'success',
            webhookResponse
          };
        } catch (webhookError) {
          console.error('Error sending to n8n webhook:', webhookError);
          return {
            isTask: true,
            taskType,
            message,
            webhookStatus: 'error',
            error: webhookError.message
          };
        }
      }
    }

    // If no task is detected, return normal conversation flow
    return {
      isTask: false,
      message
    }

  } catch (error) {
    console.error('Error analyzing conversation:', error)
    throw error
  }
} 