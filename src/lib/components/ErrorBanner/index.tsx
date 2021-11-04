import { Alert } from 'antd';
import React from 'react';

interface ErrorBannerProps {
    message?: string;
    description?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message = "Uh oh! something went wrong :( !", description = "Look like something went wrong. Please check your connection and/or try again later." }) => {
    return (
        <Alert
            banner
            closable
            message={message}
            description={description}
            type="error"
            className="error-banner"
        />
    );
}