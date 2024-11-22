var stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws'
});

stompClient.onConnect = function (frame) {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/notification.all', function (msg) {
        addMessage(JSON.parse(msg.body));
    });
    let user_id = document.getElementById("user_id").value;
    stompClient.subscribe(`/topic/notification.${user_id}`, function (msg) {
        addMessage(JSON.parse(msg.body));
    });
};

stompClient.onWebSocketError = function (error) {
    console.error('Error with websocket', error);
};

stompClient.onStompError = function (frame) {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    document.getElementById("connect").disabled = connected;
    document.getElementById("disconnect").disabled = !connected;
    if (connected) {
        document.getElementById("conversation").style.display = "block";
    } else {
        document.getElementById("conversation").style.display = "none";
    }
    document.getElementById("notifications").innerHTML = "";
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendNotification() {
    message_body = document.getElementById('notification').value
    message_title = document.getElementById('notification_title').value
    stompClient.publish({
        destination: "/notifications/send",
        body: JSON.stringify({'title': message_title, 'body': message_body})
    });
}

function addMessage(message) {
    const notifications = document.getElementById("notifications");
    const newRow = document.createElement("tr");
    const titleCell = document.createElement("td");
    const bodyCell = document.createElement("td");
    titleCell.textContent = message.title;
    bodyCell.textContent = message.body;
    console.log(message)
    newRow.appendChild(titleCell);
    newRow.appendChild(bodyCell);
    notifications.appendChild(newRow);
}

const formElements = document.querySelectorAll("form");
for (let i = 0; i < formElements.length; i++) {
    formElements[i].addEventListener('submit', function (e) {
        e.preventDefault();
    });
}

document.getElementById("connect").addEventListener("click", function () {
    connect();
});

document.getElementById("disconnect").addEventListener("click", function () {
    disconnect();
});

