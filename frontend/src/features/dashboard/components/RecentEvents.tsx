import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography,
  Skeleton,
  Chip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { RecentEvent } from '../types/dashboard.types';

interface RecentEventsProps {
  events?: RecentEvent[];
  isLoading?: boolean;
}

export const RecentEvents: React.FC<RecentEventsProps> = ({ events = [], isLoading = false }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Recent Events" />
      <CardContent>
        {isLoading ? (
          <List>
            {[1, 2, 3].map((item) => (
              <ListItem key={item} divider>
                <ListItemIcon>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Skeleton variant="text" width="80%" />} 
                  secondary={<Skeleton variant="text" width="40%" />} 
                />
              </ListItem>
            ))}
          </List>
        ) : events.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            No recent events found.
          </Typography>
        ) : (
          <List>
            {events.map((event) => (
              <ListItem key={event.id} divider>
                <ListItemIcon>
                  {event.type === 'incident' ? (
                    <WarningIcon color="error" />
                  ) : (
                    <AssignmentIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={new Date(event.timestamp).toLocaleString()}
                />
                <Chip 
                  label={event.status} 
                  size="small"
                  color={
                    event.status === 'open' || event.status === 'active' ? 'error' : 
                    event.status === 'resolved' || event.status === 'closed' ? 'success' : 
                    'default'
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
