import {notifications} from './notifications';


/**
 * A context object keeps track of the state of a patch.
 */
class Context {
  private created: Node[] = [];
  private deleted: Node[] = [];

  markCreated(node: Node) {
    this.created.push(node);
  }

  markDeleted(node: Node) {
    this.deleted.push(node);
  }


  /**
   * Notifies about nodes that were created during the patch operation.
   */
  notifyChanges() {
    if (notifications.nodesCreated && this.created.length > 0) {
      notifications.nodesCreated(this.created);
    }

    if (notifications.nodesDeleted && this.deleted.length > 0) {
      notifications.nodesDeleted(this.deleted);
    }
  }
}


export {
  Context,
};
