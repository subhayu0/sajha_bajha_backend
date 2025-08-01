import { ContactMessage } from '../../models/ContactMessage.js';

/**
 * Submit a new contact message
 *///
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const contact = await ContactMessage.create({
      name,
      email,
      message
    }); //can be extended to include phone, subject, etc.
    
    res.status(201).json({ 
      data: contact,
      message: 'Contact message submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
};

/**
 * Get all contact messages (for admin)
 */
const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ 
      data: contacts,
      message: 'Successfully retrieved contact messages' 
    });
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    res.status(500).json({ error: 'Failed to retrieve contact messages' });
  }
};

export const contactController = {
  submitContact,
  getAllContacts
};