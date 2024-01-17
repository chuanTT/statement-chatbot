// middleware request
export type configValidateValueType = {
  rules: any[];
  dependent?: string;
  isDisableKey?: boolean;
  msg: {
    [key: string]: string;
  };
};

export type variableNode = "body" | "params" | "query";

export type configValidateType = {
  [P in variableNode]?: {
    [key: string]: configValidateValueType;
  };
};
