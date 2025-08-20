import zkeSDK from "@zk-email/sdk";
import fs, {readFile} from "fs/promises";

import { dirname,join } from 'path';

// Copy slug from UI homepage
const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

async function main() {
  const sdk = zkeSDK();

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Create a prover from the blueprint
  const prover = blueprint.createProver({ isLocal: false });
//console.log(prover)

  // Get eml
  //const eml = (await fs.readFile("../emls/residency.eml")).toString();
  const filePath = join(__dirname, "emails/residency.eml");
  const eml = (await readFile(filePath)).toString();
//  const eml = (await fs.readFile(__dirname +"/zkmail/emails/residency.eml")).toString();
//console.log('__dirname:', __dirname);
//console.log('filePath:', filePath);

  // Generate and wait until proof is generated, can take up to a few minutes
  const proof = await prover.generateProof(eml);
  console.log("proof: ", proof);
process.exit()
  const { proofData, publicData } = proof.getProofData();
  console.log("proof: ", proofData);
  console.log("public: ", publicData);
}

main();
