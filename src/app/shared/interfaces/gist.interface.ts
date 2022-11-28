import { GistFile } from './gist-file';
import { GistUser } from "./gist-user";

export interface Gist {
        url: string; 
        forks_url: string;
        commits_url: string;
        id:  string;
        node_id:  string;
        git_pull_url:  string;
        git_push_url:  string;
        html_url:  string;
        files: {
            [key: string]: GistFile
          
        }
        public: boolean;
        created_at: string;
        updated_at: string;
        description: string;
        comments: number;
        user: GistUser | null
        comments_url: string;
        owner: GistUser
        truncated?: boolean;
        forks?: Gist[];
}
