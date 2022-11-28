import { GistFile } from "src/app/shared/interfaces/gist-file";

export const fileTypeFilter = (files: any): string[] => {
    let localFiles: string[] = []
    if (files) {
        files = Object.values(files);

        files.forEach((file: GistFile) => {
            if (file.language) {
                localFiles.push(file.language);
                return;
            }
            localFiles.push('Text');
        })
    }

    return localFiles.filter((val, idx, self) => {
        return self.indexOf(val) === idx;
    });
}