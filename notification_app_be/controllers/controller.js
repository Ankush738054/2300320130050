import axios from 'axios';

const PRIORITY_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

export const getPriorityNotifications = async (req, res) => {
    try {
        const n = parseInt(req.query.n) || 10; 

        const response = await axios.get(process.env.NOTIFICATIONS_SERVICE_URL, {
            headers: {
                'Authorization': `Bearer ${process.env.LOGGING_SERVICE_TOKEN}`
            }
        });
        let notifications = response.data.notifications;

        notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

            if (weightB !== weightA) {
                return weightB - weightA;
            }

            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const priorityInbox = notifications.slice(0, n);

        res.status(200).json({
            success: true,
            count: priorityInbox.length,
            data: priorityInbox
        });

    } catch (error) {
        console.error("Error processing notifications:", error.message);
        console.error("Error details:", error.response?.data || error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to process notifications",
            error: error.message
        });
    }
};