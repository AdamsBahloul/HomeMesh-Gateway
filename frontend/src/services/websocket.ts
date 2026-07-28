export class TelemetryWebSocket {
  private url: string;
  private ws: WebSocket | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private reconnectInterval = 3000;

  constructor(url: string = 'ws://localhost:8000/api/v1/ws/telemetry') {
    this.url = url;
  }

  public connect(onMessage: (data: any) => void) {
    this.onMessageCallback = onMessage;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(parsed);
          }
        } catch (e) {
          console.error("WS parsing error:", e);
        }
      };

      this.ws.onclose = () => {
        setTimeout(() => this.connect(onMessage), this.reconnectInterval);
      };
    } catch (err) {
      console.warn("WebSocket fallback mode activated");
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
