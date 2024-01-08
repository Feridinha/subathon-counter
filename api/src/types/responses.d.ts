export interface ApiDonation {
    amount: {
        currency: string
        formatted: string
        value: number
    }
    author: string
    message: string
    type: string
}

export interface ApiUser {
    name: string
    color: string
}

export interface ApiSub {
    user: ApiUser
    time: number
}

export interface ApiCheer {
    user: ApiUser
    time: number
    amount: number
}

export interface ApiSubGift {
    author: string
    receiver: string
    authorColor: string
}

export interface ApiForcedTime {
    prettyTime: string
    operator: "+" | "-" | "="
}



/*
type SubCallback = ({
    username,
    // months,
    color,
}: {
    username: string
    // months: number
    color: string
}) => void

type SubGroupCallback = ({
    username,
    // numberOfSubs,
    color,
}: {
    username: string
    // numberOfSubs: number
    color: string
}) => void

type SubGiftCallback = ({
    author,
    receiver,
    authorColor,
}: {
    author: string
    receiver: string
    authorColor: string
}) => void

*/