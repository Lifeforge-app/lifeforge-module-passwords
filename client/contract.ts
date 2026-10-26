export type EndpointMasterGetChallenge_OutputOK = string;
export type EndpointMasterHasMasterPassword_OutputOK = boolean;
export type EndpointMasterVerify_OutputOK = boolean;
export type EndpointEntriesCreate_OutputNO_CONTENT = void;
export type EndpointEntriesList_OutputOK = {
  id: string;
  name: string;
  website: string;
  username: string;
  password: string;
  icon: string;
  color: string;
  pinned: boolean;
  category: string | null;
  last_password_updated: string;
  rotation_interval: number;
  created: string;
  updated: string;
}[];
export type EndpointEntriesRemove_OutputNO_CONTENT = void;
export type EndpointEntriesTogglePin_OutputNO_CONTENT = void;
export type EndpointEntriesUpdate_OutputNO_CONTENT = void;
export type EndpointCategoriesList_OutputOK = {
  id: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
}[];
export type EndpointCategoriesRemove_OutputOK = boolean;
export type EndpointRecoveryRecover_OutputNO_CONTENT = void;

export interface Contract {
  master: {
    create: EndpointMasterCreate;
    getChallenge: EndpointMasterGetChallenge;
    getWrappedVEK: EndpointMasterGetWrappedVEK;
    hasMasterPassword: EndpointMasterHasMasterPassword;
    updateWrappedVEK: EndpointMasterUpdateWrappedVEK;
    verify: EndpointMasterVerify;
  };
  entries: {
    create: EndpointEntriesCreate;
    list: EndpointEntriesList;
    remove: EndpointEntriesRemove;
    togglePin: EndpointEntriesTogglePin;
    update: EndpointEntriesUpdate;
  };
  categories: {
    create: EndpointCategoriesCreate;
    list: EndpointCategoriesList;
    remove: EndpointCategoriesRemove;
    update: EndpointCategoriesUpdate;
  };
  recovery: {
    generate: EndpointRecoveryGenerate;
    recover: EndpointRecoveryRecover;
    status: EndpointRecoveryStatus;
  };
}
export interface EndpointMasterCreate {
  method: "post";
  input: {
    body?: EndpointMasterCreate_InputBody;
  };
  output: {
    CREATED: EndpointMasterCreate_OutputCREATED;
  };
  media: null;
}
export interface EndpointMasterCreate_InputBody {
  password: string;
}
export interface EndpointMasterCreate_OutputCREATED {
  recovery_key: string;
}
export interface EndpointMasterGetChallenge {
  method: "get";
  input: {};
  output: {
    OK: EndpointMasterGetChallenge_OutputOK;
  };
  media: null;
}
export interface EndpointMasterGetWrappedVEK {
  method: "get";
  input: {};
  output: {
    OK: EndpointMasterGetWrappedVEK_OutputOK;
  };
  media: null;
}
export interface EndpointMasterGetWrappedVEK_OutputOK {
  wrapped_vek: string;
}
export interface EndpointMasterHasMasterPassword {
  method: "get";
  input: {};
  output: {
    OK: EndpointMasterHasMasterPassword_OutputOK;
  };
  media: null;
}
export interface EndpointMasterUpdateWrappedVEK {
  method: "post";
  input: {
    body?: EndpointMasterUpdateWrappedVEK_InputBody;
  };
  output: {
    OK: EndpointMasterUpdateWrappedVEK_OutputOK;
  };
  media: null;
}
export interface EndpointMasterUpdateWrappedVEK_InputBody {
  password: string;
  new_password: string;
  new_wrapped_vek: string;
}
export interface EndpointMasterUpdateWrappedVEK_OutputOK {
  recovery_key: string;
}
export interface EndpointMasterVerify {
  method: "post";
  input: {
    body?: EndpointMasterVerify_InputBody;
  };
  output: {
    OK: EndpointMasterVerify_OutputOK;
  };
  media: null;
}
export interface EndpointMasterVerify_InputBody {
  password: string;
}
export interface EndpointEntriesCreate {
  method: "post";
  input: {
    body?: EndpointEntriesCreate_InputBody;
  };
  output: {
    NO_CONTENT: EndpointEntriesCreate_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointEntriesCreate_InputBody {
  name: string;
  website: string;
  username: string;
  password: string;
  icon: string;
  color: string;
  category?: string | null;
  rotation_interval: number;
}
export interface EndpointEntriesList {
  method: "get";
  input: {};
  output: {
    OK: EndpointEntriesList_OutputOK;
  };
  media: null;
}
export interface EndpointEntriesRemove {
  method: "post";
  input: {
    query?: EndpointEntriesRemove_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointEntriesRemove_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointEntriesRemove_InputQuery {
  id: string;
}
export interface EndpointEntriesTogglePin {
  method: "post";
  input: {
    query?: EndpointEntriesTogglePin_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointEntriesTogglePin_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointEntriesTogglePin_InputQuery {
  id: string;
}
export interface EndpointEntriesUpdate {
  method: "post";
  input: {
    query?: EndpointEntriesUpdate_InputQuery;
    body?: EndpointEntriesUpdate_InputBody;
  };
  output: {
    NO_CONTENT: EndpointEntriesUpdate_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointEntriesUpdate_InputQuery {
  id: string;
}
export interface EndpointEntriesUpdate_InputBody {
  name: string;
  website: string;
  username: string;
  password: string;
  icon: string;
  color: string;
  category?: string | null;
  rotation_interval: number;
  password_changed?: boolean;
}
export interface EndpointCategoriesCreate {
  method: "post";
  input: {
    body?: EndpointCategoriesCreate_InputBody;
  };
  output: {
    CREATED: EndpointCategoriesCreate_OutputCREATED;
  };
  media: null;
}
export interface EndpointCategoriesCreate_InputBody {
  name: string;
  icon: string;
  color: string;
}
export interface EndpointCategoriesCreate_OutputCREATED {
  id: string;
  name: string;
  color: string;
  icon: string;
}
export interface EndpointCategoriesList {
  method: "get";
  input: {};
  output: {
    OK: EndpointCategoriesList_OutputOK;
  };
  media: null;
}
export interface EndpointCategoriesRemove {
  method: "post";
  input: {
    query?: EndpointCategoriesRemove_InputQuery;
  };
  output: {
    OK: EndpointCategoriesRemove_OutputOK;
  };
  media: null;
}
export interface EndpointCategoriesRemove_InputQuery {
  id: string;
}
export interface EndpointCategoriesUpdate {
  method: "post";
  input: {
    query?: EndpointCategoriesUpdate_InputQuery;
    body?: EndpointCategoriesUpdate_InputBody;
  };
  output: {
    OK: EndpointCategoriesUpdate_OutputOK;
  };
  media: null;
}
export interface EndpointCategoriesUpdate_InputQuery {
  id: string;
}
export interface EndpointCategoriesUpdate_InputBody {
  name: string;
  icon: string;
  color: string;
}
export interface EndpointCategoriesUpdate_OutputOK {
  id: string;
  name: string;
  color: string;
  icon: string;
}
export interface EndpointRecoveryGenerate {
  method: "post";
  input: {
    body?: EndpointRecoveryGenerate_InputBody;
  };
  output: {
    OK: EndpointRecoveryGenerate_OutputOK;
  };
  media: null;
}
export interface EndpointRecoveryGenerate_InputBody {
  password: string;
}
export interface EndpointRecoveryGenerate_OutputOK {
  recovery_key: string;
}
export interface EndpointRecoveryRecover {
  method: "post";
  input: {
    body?: EndpointRecoveryRecover_InputBody;
  };
  output: {
    NO_CONTENT: EndpointRecoveryRecover_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointRecoveryRecover_InputBody {
  recovery_key: string;
  new_password: string;
}
export interface EndpointRecoveryStatus {
  method: "get";
  input: {};
  output: {
    OK: EndpointRecoveryStatus_OutputOK;
  };
  media: null;
}
export interface EndpointRecoveryStatus_OutputOK {
  has_recovery_key: boolean;
}
