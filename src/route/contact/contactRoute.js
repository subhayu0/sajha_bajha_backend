import express from 'express';
import { authenticateToken } from '../../middleware/token-middleware.js';
import { contactController } from '../../controller/contact/contactController.js';
import { ContactMessage } from '../../models/ContactMessage.js';

const router = express.Router();

// Route to submit a contact message
router.post('/', contactController.submitContact);

// Route to get all contact messages (admin only)
router.get('/', contactController.getAllContacts);

// Route to delete a contact message by ID (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the message first to check if it exists
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    
    // Delete the message
    await message.destroy();
    
    res.status(200).json({ 
      message: 'Contact message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

export { router as contactRouter };