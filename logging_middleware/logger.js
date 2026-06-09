export const Log = async (stack, level, packageName, message) => {
  try {
    const targetUrl = process.env.LOGGING_SERVICE_URL;
    const token = process.env.LOGGING_SERVICE_TOKEN;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Logger] Successfully created log on server. LogID: ${data.logID}`);
      return data;
    }
    
    console.error(`[Logger] Failed to send log. Status: ${response.status}`);
  } catch (error) {
    console.error('[Logger] Network connection error:', error.message);
  }
};

export const loggingMiddleware = async (req, res, next) => {
  const stack = "mern";
  const level = "info";
  const packageName = "notification_app_be"; 
  const message = `${req.method} request made to ${req.url}`;

  await Log(stack, level, packageName, message);
  next();
};