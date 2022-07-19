import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export default class AllowlistTree {
  list: any[];
  leafNodes: any[];
  merkleTree: MerkleTree;

  constructor (_list: any[]) {
    this.list = _list;

    /**
     * This order of transformation of the list must be the same as the one on indelliblelabs.io
     * since we need to generate the same merkle tree on our client.
     * Thoughts: I am not sure that sort() on an object array has a consistent implementation
     * but it works accross the major browsers for now, so I was ok to run with it.
     */
    this.leafNodes = this.list
      .map((e) => e.address.toLowerCase().trim())
      .filter((e) => !!(null === e || void 0 === e ? void 0 : e.length))
      .sort()
      .map(keccak256);

    this.merkleTree = new MerkleTree(
      this.leafNodes,
      keccak256,
      {
        sortPairs: true,
        hashLeaves: false
      }
    )
  }

  rootHash() {
    return this.merkleTree.getHexRoot()
  }

  getProofForAddress(address: string) {
    const hashed = keccak256(address)
    const proof = this.merkleTree.getHexProof(hashed.toString('hex'))
    return proof
  }
}
