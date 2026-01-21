import { Equiry } from '../config/db.js';

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await Equiry.create(req.body);
        res.status(201).json({ success: true, message: 'Enquiry created successfully', data: enquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating enquiry', error: error.message });
    }
}

export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Equiry.findAll();
        res.status(200).json({ success: true, data: enquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching enquiries', error: error.message });
    }
}