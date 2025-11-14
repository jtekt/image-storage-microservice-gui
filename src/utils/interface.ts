
export interface Condition {
    type: "condition";
    key: string;
    value: string;
    not: boolean;
    valueType: "string" | "number";
}

export interface Group {
    type: "group";
    op: string;
    children: Array<Group | Condition>;
}
