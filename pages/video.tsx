import React from "react";
import { Button, Typography } from "antd";
import { Card } from "@nextui-org/react";

const { Title, Paragraph } = Typography;

const UpdateVideoPage: React.FC = () => {
  const handleRedirect = () => {
    window.location.href =
      "https://1ws0dq-my.sharepoint.com/:v:/g/personal/akkk_tzpro_xyz/EfeKcRCNNVNOlDvLqDsWoVMBioAmNjEYHZSHTQRbk8fNFw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=6UGCbB";
  };

  const handleSkip = () => {
    window.location.href = "/input";
  };

  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <Title level={1} style={styles.title}>
          我们更新了教程视频
        </Title>
        <Paragraph style={styles.paragraph}>
          点击下方按钮查看最新视频教程。
        </Paragraph>

        <div
          aria-label="Fake Video Frame"
          role="button"
          style={styles.fakeVideoFrame}
          tabIndex={0}
          onClick={handleRedirect}
          onKeyDown={handleRedirect}
        >
          <div style={styles.playIcon} />
        </div>

        <div style={styles.buttonContainer}>
          <Button style={styles.button} type="primary" onClick={handleRedirect}>
            查看教程
          </Button>
          <Button style={styles.button} onClick={handleSkip}>
            跳过
          </Button>
        </div>
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: "16px",
    color: "#333",
  },
  paragraph: {
    marginBottom: "24px",
    color: "#555",
  },
  fakeVideoFrame: {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
    position: "relative",
    cursor: "pointer",
  },
  playIcon: {
    width: "0",
    height: "0",
    borderLeft: "20px solid #fff",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: "4px",
  },
};

export default UpdateVideoPage;
