export interface ProfileImages {
    small?: string;
    medium?: string;
    normal?: string;
    big?: string;
    default?: string;
}

export interface Profile {
    id: string;
    name_perfil: string;
    avatar: string;
    default: boolean;
    images: ProfileImages | [];
}

export interface AvatarItem {
    id: string;
    images: ProfileImages;
}

export interface AvatarGroup {
    name: string;
    avatars: AvatarItem[];
}

export interface ProfilesResponse {
    status: string;
    code: number;
    total_records?: number;
    total_display_records?: number;
    data?: Profile[];
    msj?: string;
}

export interface AvatarsResponse {
    status: string;
    code: number;
    total_records?: number;
    total_display_records?: number;
    last_page?: number;
    data?: AvatarGroup[];
    msj?: string;
}

export interface ProfileMutationResponse {
    status: string;
    code: number;
    msj?: string;
}
