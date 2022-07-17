import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import keccak256 from 'keccak256';

export default class AllowlistTree {
  list: any[];
  leafNodes: any[];
  merkleTree: MerkleTree;

  constructor (_list: any[]) {
    this.list = _list;
    // this.leafNodes = this.list.map(item => item.addresse.toLowerCase().trim()).sort()
    this.leafNodes = this.list
      .map((e) => e.address.toLowerCase().trim())
      .filter((e) => !!(null === e || void 0 === e ? void 0 : e.length))
      .sort()
      .map(keccak256);

    this.merkleTree = new MerkleTree(
      this.leafNodes,
      // (value: string) => keccak256(ethers.utils.solidityPack(['address'], [value])),
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
// 0x5fa99ffb039bb04b388196a66b70012121c44cbbd338ab4b997a62d8157d3a1e
0x29875c432353966316e8f4f5e6473f1ba575ad3ac19a626190ce0f2c4d0e6741
