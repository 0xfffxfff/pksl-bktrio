import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import keccak256 from 'keccak256';

export default class AllowlistTree {
  list: any[];
  leafNodes: any[];
  merkleTree: MerkleTree;

  constructor (_list: any[]) {
    this.list = _list;
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
