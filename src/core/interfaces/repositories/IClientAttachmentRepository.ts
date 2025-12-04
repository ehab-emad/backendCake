export interface ClientAttachment {
  id: string;
  path: string;
}

export interface IClientAttachmentRepository {
  listForClient(clientId: string): Promise<ClientAttachment[]>;

  add(clientId: string, path: string): Promise<ClientAttachment>;

  removeById(attachmentId: string): Promise<void>;
}
