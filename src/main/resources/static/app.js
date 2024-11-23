const socketFactory = () => new SockJS('http://localhost:8080/ws');

const onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);

    // Subscribe to the public broadcast topic
    stompClient.subscribe('/topic/notification.all', function (msg) {
        console.log(msg)
        addMessage(JSON.parse(msg.body));
    });

    // Subscribe to the user's private topic
    const userId = document.getElementById("user_id").value.trim();
    if (userId) {
        stompClient.subscribe(`/topic/notification.${userId}`, function (msg) {
            addMessage(JSON.parse(msg.body));
        });
    } else {
        console.warn("User ID is empty. Private notifications won't be received.");
    }
};

const onStompError = (frame) => {
    console.error('STOMP error: ' + frame.headers['message']);
    console.error('Details: ' + frame.body);
};

const onWebSocketError = (error) => console.error('WebSocket error:', error);

const stompClient = new StompJs.Client({
    webSocketFactory: socketFactory,
    debug: () => {},
    onConnect: onConnect,
    onStompError: onStompError,
    onWebSocketError: onWebSocketError
});

const setConnected = (connected) => {
    document.getElementById("connect").disabled = connected;
    document.getElementById("disconnect").disabled = !connected;
    document.getElementById("conversation").style.visibility = connected ? "visible" : "hidden";

    if (!connected) {
        document.getElementById("notifications").innerHTML = "";
    }
}

const connect = () => stompClient.activate();

const disconnect = () => {
    stompClient.deactivate();
    setConnected(false);
}

const addMessage = (message) => {
    const notifications = document.getElementById("notifications");
    const newRow = document.createElement("tr");

    // Create cells for title and body
    const titleCell = document.createElement("td");
    const bodyCell = document.createElement("td");

    // Populate cells
    titleCell.textContent = message.title || "No Title";
    bodyCell.textContent = message.body || "No Content";

    // Append cells to the row
    newRow.appendChild(titleCell);
    newRow.appendChild(bodyCell);

    // Append the row to the notifications table
    notifications.appendChild(newRow);

    console.log("Notification received:", message);
}

document.querySelectorAll("form").forEach((form) =>
    form.addEventListener('submit', (e) => e.preventDefault())
);

document.getElementById("connect").addEventListener("click", connect);
document.getElementById("disconnect").addEventListener("click", disconnect);
