import {
  Channel,
  LikedToRequest,
  LogRequest,
  SubscribedToRequest,
  Video,
} from "@/assets/types";
import { Client, Account, Databases, Storage, Query, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint(
    import.meta.env.VITE_PROJECT_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(import.meta.env.VITE_PROJECT_ID || "6589e746eb9939772690");

const account = new Account(client);

const databases = new Databases(client);

const storage = new Storage(client);

export const logout = () => {
  try {
    const user = account.deleteSession("current");
    return user;
  } catch (error) {
    return error;
  }
};

export const loginHCUser = (email: string, password: string) => {
  try {
    const user = account.createEmailSession(email, password);
    return user;
  } catch (error) {
    return error;
  }
};

export const createHCUser = (id: string, email: string, name: string) => {
  try {
    const user = account.create(id, email, id, name);
    return user;
  } catch (error) {
    return error;
  }
};

export const checkUserData = async () => {
  try {
    const account = new Account(client);
    return account.get();
  } catch {
    const appwriteError = new Error("Appwrite Error");
    throw new Error(appwriteError.message);
  }
};

export const updateEmail = (email: string, id: string) => {
  try {
    const user = account.updateEmail(email, id);
    return user;
  } catch (error) {
    return error;
  }
};

export const updateName = (name: string) => {
  try {
    const user = account.updateName(name);
    return user;
  } catch (error) {
    return error;
  }
};

export const updatePhone = (phone: string, id: string) => {
  try {
    const user = account.updatePhone(phone, id);
    return user;
  } catch (error) {
    return error;
  }
};

export const getChannel = async (ownerId: string) => {
  try {
    const owner = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      ownerId
    );
    return owner;
  } catch (error) {
    return error;
  }
};

export const getPFP = (pfpId: string) => {
  try {
    const pfp = storage.getFileView(
      import.meta.env.VITE_PFP_BUCKET_ID || "",
      pfpId
    );
    return pfp;
  } catch (error) {
    return error;
  }
};

export const getImage = (imageId: string) => {
  try {
    const image = storage.getFileView(
      import.meta.env.VITE_IMAGES_BUCKET_ID || "",
      imageId
    );
    return image;
  } catch (error) {
    return error;
  }
};

export const getVideo = (videoId: string) => {
  try {
    const video = storage.getFileView(
      import.meta.env.VITE_VIDEOS_BUCKET_ID || "",
      videoId
    );
    return video;
  } catch (error) {
    return error;
  }
};

export const getVideoDownload = (videoId: string) => {
  try {
    const video = storage.getFileDownload(
      import.meta.env.VITE_VIDEOS_BUCKET_ID || "",
      videoId
    );
    return video;
  } catch (error) {
    return error;
  }
};

export const getVideoDataById = async (id: string) => {
  try {
    const video = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      id
    );
    return video;
  } catch (error) {
    return error;
  }
};

export const getVideosByCategory = async (category: string) => {
  try {
    var videos;
    if (category === "") {
      videos = await databases.listDocuments(
        import.meta.env.VITE_HC_HUB_DB_ID || "",
        import.meta.env.VITE_VIDEOS_TABLE_ID || ""
      );
    } else {
      videos = await databases.listDocuments(
        import.meta.env.VITE_HC_HUB_DB_ID || "",
        import.meta.env.VITE_VIDEOS_TABLE_ID || "",
        [Query.equal("category", category)]
      );
    }
    return videos;
  } catch (error) {
    return error;
  }
};

export const getVideosBySearch = async (search: string) => {
  try {
    const videos = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      [Query.search("title", search)]
    );
    return videos;
  } catch (error) {
    return error;
  }
};

export const uploadPFP = async (file: File) => {
  try {
    const pfp = await storage.createFile(
      import.meta.env.VITE_PFP_BUCKET_ID || "",
      ID.unique(),
      file
    );
    return pfp;
  } catch (error) {
    return error;
  }
};

export const updatePFP = async (
  channelId: string,
  prevId: string,
  file: File
) => {
  try {
    await storage.deleteFile(import.meta.env.VITE_PFP_BUCKET_ID || "", prevId);
    const pfp = await storage.createFile(
      import.meta.env.VITE_PFP_BUCKET_ID || "",
      ID.unique(),
      file
    );

    await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      channelId,
      {
        pfp: pfp.$id,
      }
    );
    return pfp;
  } catch (error) {
    return error;
  }
};

export const createChannel = async (
  user: string,
  username: string,
  pfp: string
) => {
  try {
    const channel = await databases.createDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      ID.unique(),
      {
        user: user,
        username: username,
        pfp: pfp,
        Subscribers: [],
        Videos: [],
      }
    );
    return channel;
  } catch (error) {
    return error;
  }
};

export const updateChannel = async (
  id: string,
  username: string,
  pfp: string
) => {
  try {
    const channel = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      id,
      {
        username: username,
        pfp: pfp,
      }
    );
    return channel;
  } catch (error) {
    return error;
  }
};

export const getChannelById = async (id: string) => {
  try {
    const channel = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      id
    );
    return channel;
  } catch (error) {
    return error;
  }
};

export const getChannelsBySearch = async (search: string) => {
  try {
    const channels = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      [Query.search("username", search)]
    );
    return channels;
  } catch (error) {
    return error;
  }
};

export const getChannelByUserId = async (userId: string) => {
  try {
    const channel = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      [Query.equal("user", userId)]
    );
    return channel;
  } catch (error) {
    return error;
  }
};

export const getSubscribedTo = async (userId: string) => {
  try {
    const subscribedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    if (subscribedTo.total === 0) {
      const newSubscribedTo = await databases.createDocument(
        import.meta.env.VITE_HC_HUB_DB_ID || "",
        import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
        ID.unique(),
        {
          userId: userId,
          Channels: [],
        }
      );
      return newSubscribedTo;
    } else {
      return subscribedTo;
    }
  } catch (error) {
    return error;
  }
};

export const subscribeToChannel = async (userId: string, channelId: string) => {
  try {
    const subscribedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    const subscribedToRequest = subscribedTo as unknown as SubscribedToRequest;

    const channel = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      channelId
    );

    const channelRequest = channel as unknown as Channel;

    subscribedToRequest.documents[0].Channels.push(channelRequest);

    const updatedSubscribedTo = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
      subscribedToRequest.documents[0].$id,
      {
        Channels: subscribedToRequest.documents[0].Channels,
      }
    );
    return updatedSubscribedTo;
  } catch (error) {
    return error;
  }
};

export const unsubscribeFromChannel = async (
  userId: string,
  channelId: string
) => {
  try {
    const subscribedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    const subscribedToRequest = subscribedTo as unknown as SubscribedToRequest;

    const channel = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_CHANNELS_TABLE_ID || "",
      channelId
    );

    const channelRequest = channel as unknown as Channel;

    subscribedToRequest.documents[0].Channels =
      subscribedToRequest.documents[0].Channels.filter(
        (channel: any) => channel.$id !== channelRequest.$id
      );
    const updatedSubscribedTo = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_SUBSCRIPTIONS_TABLE_ID || "",
      subscribedToRequest.documents[0].$id,
      {
        Channels: subscribedToRequest.documents[0].Channels,
      }
    );
    return updatedSubscribedTo;
  } catch (error) {
    return error;
  }
};

export const getLikedTo = async (userId: string) => {
  try {
    const likedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LIKES_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    if (likedTo.total === 0) {
      const newLikedTo = await databases.createDocument(
        import.meta.env.VITE_HC_HUB_DB_ID || "",
        import.meta.env.VITE_LIKES_TABLE_ID || "",
        ID.unique(),
        {
          userId: userId,
          Videos: [],
        }
      );
      return newLikedTo;
    } else {
      return likedTo;
    }
  } catch (error) {
    return error;
  }
};

export const likeVideo = async (userId: string, videoId: string) => {
  try {
    const likedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LIKES_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    const likedToRequest = likedTo as unknown as LikedToRequest;

    const video = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      videoId
    );

    const videoRequest = video as unknown as Video;

    likedToRequest.documents[0].Videos.push(videoRequest);

    const updatedLikedTo = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LIKES_TABLE_ID || "",
      likedToRequest.documents[0].$id,
      {
        Videos: likedToRequest.documents[0].Videos,
      }
    );
    return updatedLikedTo;
  } catch (error) {
    return error;
  }
};

export const unlikeVideo = async (userId: string, videoId: string) => {
  try {
    const likedTo = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LIKES_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    const likedToRequest = likedTo as unknown as LikedToRequest;

    const video = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      videoId
    );

    const videoRequest = video as unknown as Channel;

    likedToRequest.documents[0].Videos =
      likedToRequest.documents[0].Videos.filter(
        (video: any) => video.$id !== videoRequest.$id
      );
    const updatedLikedTo = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LIKES_TABLE_ID || "",
      likedToRequest.documents[0].$id,
      {
        Videos: likedToRequest.documents[0].Videos,
      }
    );
    return updatedLikedTo;
  } catch (error) {
    return error;
  }
};

export const getLog = async (userId: string) => {
  try {
    const log = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LOG_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    if (log.total === 0) {
      const newLog = await databases.createDocument(
        import.meta.env.VITE_HC_HUB_DB_ID || "",
        import.meta.env.VITE_LOG_TABLE_ID || "",
        ID.unique(),
        {
          userId: userId,
          Videos: [],
        }
      );
      return newLog;
    } else {
      return log;
    }
  } catch (error) {
    return error;
  }
};

export const addToLog = async (userId: string, videoId: string) => {
  try {
    const log = await databases.listDocuments(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LOG_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    const logRequest = log as unknown as LogRequest;

    const video = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      videoId
    );

    const videoRequest = video as unknown as Video;

    logRequest.documents[0].Videos.push(videoRequest);

    const updatedLog = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_LOG_TABLE_ID || "",
      logRequest.documents[0].$id,
      {
        Videos: logRequest.documents[0].Videos,
      }
    );
    return updatedLog;
  } catch (error) {
    return error;
  }
};

export const giveVideoView = async (videoId: string) => {
  try {
    const video = await databases.getDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      videoId
    );

    const videoRequest = video as unknown as Video;

    const updatedVideo = await databases.updateDocument(
      import.meta.env.VITE_HC_HUB_DB_ID || "",
      import.meta.env.VITE_VIDEOS_TABLE_ID || "",
      videoRequest.$id,
      {
        views: videoRequest.views + 1,
      }
    );
    return updatedVideo;
  } catch (error) {
    return error;
  }
};
