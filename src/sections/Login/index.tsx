import React, { useEffect, useRef } from "react";
import { Card, Typography, Layout, Spin } from "antd";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { AUTH_URL } from "../../lib/graphql/queries";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/Login/__generated__/LogIn";

// Image Assets
import googleLogo from "./assets/google_logo.jpg";
import { displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { ErrorBanner } from "../../lib/components";
import { Redirect } from "react-router-dom";

interface LoginProps {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login: React.FC<LoginProps> = ({ setViewer }) => {
  const client = useApolloClient();
  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn) {
          setViewer(data.logIn);
          displaySuccessNotification("You've successfully logged in!")
        }
      },
    }
    );

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log(code);

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });

      // window.open(data.authUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,500,left=500,width=800,height=800");
      window.location.assign(data.authUrl);
    } catch (error) {
      displayErrorMessage(
        "Sorry we weren't able to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`user/${viewerId}`} exact />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry we weren't able to log you in. Please try again later." />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              ????
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          onClick={handleAuthorize}
          className="log-in-card__google-button"
        >
          <img
            alt="Google logo"
            className="log-in-card__google-button-logo"
            src={googleLogo}
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in you'll be redirected to the Google consent form to
          sign in with your google account.
        </Text>
      </Card>
    </Content>
  );
};
