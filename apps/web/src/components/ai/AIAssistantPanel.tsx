// ============================================================================
// DataFusion AI — AI Assistant Panel
// Slide-in chat panel with streaming-style message display
// ============================================================================

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Chip,
  alpha,
} from '@mui/material';
import {
  CloseOutlined,
  SendOutlined,
  SmartToyOutlined,
  AutoAwesomeOutlined,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { setAIPanelOpen } from '../../store/slices/uiSlice';
import { brand } from '../../theme/theme';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  '🔌 How do I create a REST API connector?',
  '📊 Analyze my data quality issues',
  '🗺️ Suggest field mappings for my schema',
  '🔧 Why did my last job fail?',
  '📄 Generate integration documentation',
];

const AIAssistantPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.aiPanelOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your DataFusion AI Assistant. I can help you with:\n\n• **Creating integrations** — Set up new data flows\n• **Schema mapping** — AI-powered field matching\n• **Troubleshooting** — Diagnose failed jobs\n• **Data quality** — Analyze and improve your data\n• **Documentation** — Auto-generate docs\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I understand your request. In a production environment, I would connect to the AI backend service to process this. For now, I'm available as a UI stub ready for Phase 2 AI integration.\n\nWould you like me to help with anything else?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => dispatch(setAIPanelOpen(false))}
      sx={{
        '& .MuiDrawer-paper': {
          width: 420,
          borderLeft: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${alpha(brand.accent, 0.08)} 0%, ${alpha(brand.primary, 0.05)} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${brand.accent} 0%, ${brand.primary} 100%)`,
            }}
          >
            <SmartToyOutlined sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: brand.accent }}>
              <AutoAwesomeOutlined sx={{ fontSize: 10, mr: 0.3, verticalAlign: 'middle' }} />
              Powered by AI
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => dispatch(setAIPanelOpen(false))} size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: '0.75rem',
                flexShrink: 0,
                background:
                  msg.role === 'assistant'
                    ? `linear-gradient(135deg, ${brand.accent}, ${brand.primary})`
                    : `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
              }}
            >
              {msg.role === 'assistant' ? <SmartToyOutlined sx={{ fontSize: 16 }} /> : 'SA'}
            </Avatar>
            <Box
              sx={{
                maxWidth: '80%',
                px: 2,
                py: 1.5,
                borderRadius: '14px',
                bgcolor:
                  msg.role === 'user'
                    ? alpha(brand.primary, 0.15)
                    : alpha('#fff', 0.04),
                border: '1px solid',
                borderColor:
                  msg.role === 'user'
                    ? alpha(brand.primary, 0.2)
                    : 'divider',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  '& strong': { fontWeight: 700 },
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>'),
                }}
              />
            </Box>
          </Box>
        ))}

        {/* Suggestions (show only if no user messages) */}
        {messages.length <= 1 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Try asking:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {suggestions.map((s, i) => (
                <Chip
                  key={i}
                  label={s}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setInput(s);
                  }}
                  sx={{
                    justifyContent: 'flex-start',
                    height: 'auto',
                    py: 0.5,
                    '& .MuiChip-label': { whiteSpace: 'normal', fontSize: '0.78rem' },
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: brand.accent,
                      bgcolor: alpha(brand.accent, 0.08),
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask DataFusion AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{
            alignSelf: 'flex-end',
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.accent} 100%)`,
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': {
              background: `linear-gradient(135deg, ${brand.primary} 20%, ${brand.accent} 120%)`,
            },
            '&.Mui-disabled': {
              background: 'action.disabledBackground',
              color: 'text.disabled',
            },
          }}
        >
          <SendOutlined fontSize="small" />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default AIAssistantPanel;
