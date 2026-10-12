import { SpotColumnRef } from "../spotColumn.js";
import { SpotRowRef } from "../spotRow.js";
import { SpotColumnRef as GeneralSpotColumnRef } from '../spotColumn.js'
import { SpotRowRef as GeneralSpotRowRef } from '../spotRow.js'

export class GridMarker {
  attr_id: string;
  attr_version: string
  Label: string | undefined;
  SpotColumnRef: SpotColumnRef | undefined;
  SpotRowRef: SpotRowRef | undefined;

  constructor({
    attr_id,
    attr_version,
    Label,
    SpotColumnRef,
    SpotRowRef
  }: { attr_id: string; attr_version: string, Label: string | undefined, SpotColumnRef: SpotColumnRef, SpotRowRef: SpotRowRef}) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
    this.SpotColumnRef = SpotColumnRef ? new GeneralSpotColumnRef(SpotColumnRef) : undefined
    this.SpotRowRef = SpotRowRef ? new GeneralSpotRowRef(SpotRowRef) : undefined
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label,
      SpotColumnRef: this.SpotColumnRef?.toXML(),
      SpotRowRef: this.SpotRowRef?.toXML()
    }
  }
}
