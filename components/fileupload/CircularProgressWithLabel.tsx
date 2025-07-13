import * as React from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export type CircularProgressWithLabelProps = CircularProgressProps & { value: number };

export const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({ value, ...props }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={value} {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};
