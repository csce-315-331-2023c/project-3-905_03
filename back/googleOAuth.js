const jwt = require('jsonwebtoken');

exports.verifyGoogleToken = async (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is not set in the environment variables.");
    }

    console.log(req.body);  

    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log(payload); 

        const userForToken = {
            email: payload.email,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: payload
        });
    } catch (error) {
        res.status(400).json({ message: 'Token Verification Failure', error: error.toString() });
    }
};
