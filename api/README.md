# Subgift

client.on("subgift")

```js
{
  channel: "#feridinha",
  username: "ghiletofar",
  streak: 0,
  recipient: "Zander.Bernhard7",
  methods: {
    prime: false,
    plan: "3000",
    planName: "Tier 3",
  },
  userstate: {
    "badge-info": {
      subscriber: "0",
    },
    badges: {
      subscriber: "0",
      "sub-gifter": "1",
    },
    color: "#672f0f",
    "display-name": "ghiletofar",
    emotes: null,
    flags: null,
    id: "353fcc9e-cb8a-4af1-a793-482f1c008a12",
    login: "ghiletofar",
    mod: null,
    "msg-id": "subgift",
    "msg-param-months": true,
    "msg-param-recipient-display-name": "Zander.Bernhard7",
    "msg-param-recipient-id": null,
    "msg-param-recipient-user-name": "Zander.Bernhard7",
    "msg-param-sender-count": true,
    "msg-param-sub-plan-name": "Tier 3",
    "msg-param-sub-plan": "3000",
    "room-id": "e74ea930-9dec-4af7-bb52-93c10e7fae43",
    "system-msg": "ghiletofar gifted a Tier 3 sub to Zander.Bernhard7! They have given 1 Gift Sub in the channel!",
    "tmi-sent-ts": "1704225982367",
    "user-id": "0e5a8d6e-03c9-4352-9284-c66facf8d81b",
    "user-type": null,
    "emotes-raw": null,
    "badge-info-raw": "subscriber/0",
    "badges-raw": "subscriber/0,sub-gifter/1",
    "message-type": "subgift",
  },
}
```

Resubscription
client.on("resub")

```js
{
  channel: "#feridinha",
  username: "robert",
  months: 0,
  message: null,
  userstate: {
    "badge-info": {
      subscriber: "3",
      premium: "1",
    },
    badges: {
      subscriber: "3",
      premium: "1",
    },
    color: "#c87c24",
    "display-name": "robert",
    emotes: null,
    flags: null,
    id: "c90185d3-9bb8-4e7b-b6a8-b0d7009fdca6",
    login: "robert",
    mod: null,
    "msg-id": "resub",
    "msg-param-cumulative-months": "3",
    "msg-param-months": null,
    "msg-param-should-share-streak": null,
    "msg-param-sub-plan-name": "Tier 1",
    "msg-param-sub-plan": "1000",
    "room-id": "805d0758-1995-427a-af3d-f71357bb4b0a",
    subscriber: true,
    "system-msg": "robert subscribed at Tier 1. They've subscribed for 3 months!",
    "tmi-sent-ts": "1704226236308",
    "user-id": "0f03ceac-0955-4a24-bea7-aebe14f73c1f",
    "user-type": null,
    "emotes-raw": null,
    "badge-info-raw": "subscriber/3,premium/1",
    "badges-raw": "subscriber/3,premium/1",
    "message-type": "resub",
  },
  methods: {
    prime: false,
    plan: "1000",
    planName: "Tier 1",
  },
}
```


Subscription
client.on("subscription")
```json
{
  channel: "#feridinha",
  username: "robert",
  methods: {
    prime: false,
    plan: "1000",
    planName: "Tier 1",
  },
  message: null,
  userstate: {
    "badge-info": {
      subscriber: "0",
      premium: "1",
    },
    badges: {
      subscriber: "0",
      premium: "1",
    },
    color: "#40c756",
    "display-name": "robert",
    emotes: null,
    flags: null,
    id: "49516e01-985e-4165-ade1-90c284380aca",
    login: "robert",
    mod: null,
    "msg-id": "sub",
    "msg-param-cumulative-months": true,
    "msg-param-months": null,
    "msg-param-should-share-streak": null,
    "msg-param-sub-plan-name": "Tier 1",
    "msg-param-sub-plan": "1000",
    "room-id": "bfe29a59-bbbe-4b75-b5d8-4bbc98800a6d",
    subscriber: true,
    "system-msg": "robert subscribed at Tier 1.",
    "tmi-sent-ts": "1704227624457",
    "user-id": "86df2422-02d7-4b85-bef7-fae1447d066c",
    "user-type": null,
    "emotes-raw": null,
    "badge-info-raw": "subscriber/0,premium/1",
    "badges-raw": "subscriber/0,premium/1",
    "message-type": "sub",
  },
}
```