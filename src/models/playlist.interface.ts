export interface Playlist {
    id: string;
    image: string;
    name: string;
    creator: string;
    numOfSongs: number;
}

export interface PlaylistSongs {
    id: string;
    playlistId: string;
    artistProfilePicture?: string | null;
    artistProfileBigPicture?: string | null;
    url: string;
    name: string;
    artist: string;
    playDuration: string;
    videoUrl: string;
}
