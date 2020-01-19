#include <WiFi.h>

// WiFi network name and password:
const char * networkName = "KSC1-LHP-K00719-LINUX";
const char * networkPswd = "Q16TXU7w";

// Internet domain to request from:
const char * hostDomain = "pavoldrotar.com";
const long hostPort = 5000;

const int BUTTON_PIN = 0;
const int LED_PIN = 13;

int trigPin = 21;    // Trigger
int echoPin = 17;    // Echo

long duration,cm,inches;

//////////////////////////////////
long dist_thresh = 10;
long time_delay = 5000;

/////////////////////////////////

void setup()
{
  // Initilize hardware:
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Connect to the WiFi network (see function below loop)
  connectToWiFi(networkName, networkPswd);

  digitalWrite(LED_PIN, LOW); // LED off
  Serial.print("Press button 0 to connect to ");
  Serial.println(hostDomain);
}

void loop()
{

    if(scan_distance() < dist_thresh){
      digitalWrite(LED_PIN, HIGH);
      delay(500);
      requestURL(hostDomain, hostPort, 0); // Connect to server, bin full
      digitalWrite(LED_PIN, LOW);
    } else {
      digitalWrite(LED_PIN, HIGH);
      delay(500);
      requestURL(hostDomain, hostPort, 1); // Connect to server, bin empty
      digitalWrite(LED_PIN, LOW);
    }

    delay(time_delay);
}

void connectToWiFi(const char * ssid, const char * pwd)
{
  int ledState = 0;

  printLine();
  Serial.println("Connecting to WiFi network: " + String(ssid));

  WiFi.begin(ssid, pwd);

  while (WiFi.status() != WL_CONNECTED) 
  {
    // Blink LED while we're connecting:
    digitalWrite(LED_PIN, ledState);
    ledState = (ledState + 1) % 2; // Flip ledState
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void requestURL(const char * host, long port, int empty)
{
  printLine();
  Serial.println("Connecting to domain: " + String(host));
  Serial.println(String(port));
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(host, port))
  {
    Serial.println("connection failed");
    return;
  }
  Serial.println("Connected!");
  printLine();

  // This will send the request to the server
  //client.print((String)"GET / HTTP/1.1\r\n" +
               //"Host: " + String(host) + "\r\n" +
               //"Connection: close\r\n\r\n");
  if(empty){
  client.print((String)"GET /empty?id=bin1 HTTP/1.1\r\n"
                "Host: pavoldrotar.com:5000" + "\r\n" +
                "Cache-Control: no-cache\r\n\r\n");
  } else {
  client.print((String)"GET /full?id=bin1 HTTP/1.1\r\n"
                "Host: pavoldrotar.com:5000" + "\r\n" +
                "Cache-Control: no-cache\r\n\r\n");
  }
               
  unsigned long timeout = millis();
  while (client.available() == 0) 
  {
    if (millis() - timeout > 5000) 
    {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) 
  {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println();
  Serial.println("closing connection");
  client.stop();
}

void printLine()
{
  Serial.println();
  for (int i=0; i<30; i++)
    Serial.print("-");
  Serial.println();
}

int scan_distance(){
  // The sensor is triggered by a HIGH pulse of 10 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
 
  // Convert the time into a distance
  cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
  inches = (duration/2) / 74;   // Divide by 74 or multiply by 0.0135

  return cm;
}
