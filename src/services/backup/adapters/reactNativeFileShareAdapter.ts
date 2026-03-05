export interface BackupFileAdapter {
  writeFile: (path: string, content: string, encoding: 'utf8') => Promise<void>;
  readFile: (path: string, encoding: 'utf8') => Promise<string>;
  share: (payload: { url: string; type: string; filename: string }) => Promise<void>;
  getDocumentDirectoryPath: () => string;
}

interface ReactNativeFileSystemModule {
  DocumentDirectoryPath: string;
  writeFile: (path: string, content: string, encoding: 'utf8') => Promise<void>;
  readFile: (path: string, encoding: 'utf8') => Promise<string>;
}

interface ReactNativeShareModule {
  open: (payload: { url: string; type: string; filename: string }) => Promise<void>;
}

export class ReactNativeFileShareAdapter implements BackupFileAdapter {
  constructor(
    private readonly fileSystem: ReactNativeFileSystemModule,
    private readonly shareModule: ReactNativeShareModule
  ) {}

  getDocumentDirectoryPath(): string {
    return this.fileSystem.DocumentDirectoryPath;
  }

  async writeFile(path: string, content: string, encoding: 'utf8'): Promise<void> {
    await this.fileSystem.writeFile(path, content, encoding);
  }

  async readFile(path: string, encoding: 'utf8'): Promise<string> {
    return this.fileSystem.readFile(path, encoding);
  }

  async share(payload: { url: string; type: string; filename: string }): Promise<void> {
    await this.shareModule.open(payload);
  }
}
