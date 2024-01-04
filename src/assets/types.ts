export type Video = {
    $id: string;
    $createdAt: string;
    title: string;
    description: string;
    category: string;
    image: string;
    video: string;
    views: number;
    Channel: Channel;
    Likes: LikedTo[];
};

export type VideoRequest = {
    documents: Video[];
    total: number;
};

export type Channel = {
    $id: string;
    $createdAt: string;
    user: string;
    username: string;
    Subscribers: SubscribedTo[];
    Videos: Video[];
    pfp: string;
};

export type ChannelRequest = {
    documents: Channel[];
    total: number;
};

export type SubscribedTo = {
    $id: string;
    userId: string;
    Channels: Channel[];
};

export type SubscribedToRequest = {
    documents: SubscribedTo[];
    total: number;
};

export type LikedTo = {
    $id: string;
    userId: string;
    Videos: Video[];
};

export type LikedToRequest = {
    documents: LikedTo[];
    total: number;
};

export type Log = {
    $id: string;
    userId: string;
    Videos: Video[];
};

export type LogRequest = {
    documents: Log[];
    total: number;
};