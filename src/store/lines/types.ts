import { AnyAction } from "redux";

export const UPDATE_TEXT = "UPDATE_TEXT";
export const UPDATE_PATH = "UPDATE_PATH";
export const REMOVE_LINE = "REMOVE_LINE";
export const CREATE_LINE = "CREATE_LINE";
export const ADD_LINE_VERSION = "ADD_LINE_VERSION";

export const REMOVE_LINE_AT_LOCATION = "REMOVE_LINE_AT_LOCATION";
export const UPDATE_TEXT_AT_LOCATION = "UPDATE_TEXT_AT_LOCATION_AND_VERSION";

export interface LineVersion {
  text: string;
  line: LineId;
}

export type LineVersionId = string;

export interface Location {
  path: string;
  index: number;
}

export type AllLineVersions = LineVersionId[];
export interface LineVersionsById { [lineVersionId: string]: LineVersion };
export interface LineVersions {
  byId: LineVersionsById
  allLineVersions: AllLineVersions
}

export interface Line {
  location: Location;
  versions: LineVersionId[];
}

export type LineId = string;

export type AllLines = LineId[];
export interface LinesById { [lineId: string]: Line };
export interface Lines {
  byId: LinesById
  /**
   * Order of lines in allLines is meaningless, as these lines will be from many different files.
   * Use the location property of lines if you want to sort them.
   */
  allLines: AllLines
}

export interface UpdateTextAction {
  type: typeof UPDATE_TEXT;
  lineVersionId: LineVersionId;
  text: string;
}

export interface UpdateTextAtLocationAction {
  type: typeof UPDATE_TEXT_AT_LOCATION;
  location: Location;
  version: number;
  text: string;
}

export interface UpdatePathAction {
  type: typeof UPDATE_PATH;
  path: string;
  newPath: string;
}

export interface CreateLineAction {
  type: typeof CREATE_LINE;
  id: LineId;
  initialVersionId?: LineVersionId;
  initialVersionText?: string;
  insert: boolean;
  location: Location;
}

export interface RemoveLineAction {
  type: typeof REMOVE_LINE;
  id: LineId;
}

export interface RemoveLineAtLocationAction {
  type: typeof REMOVE_LINE_AT_LOCATION;
  location: Location;
}

export type LineActionTypes =
  | UpdateTextAction
  | UpdatePathAction
  | RemoveLineAction
  | CreateLineAction
  | RemoveLineAtLocationAction
  | UpdateTextAtLocationAction;

export function isLineAction(action: AnyAction): action is LineActionTypes {
  return (action as LineActionTypes).type !== undefined;
}