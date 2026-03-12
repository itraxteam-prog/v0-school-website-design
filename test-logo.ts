// test-logo.ts
import { getSchoolLogo } from "./lib/pdf/pdf-assets";

async function main() {
    console.log("Fetching logo...");
    const logoUrl = await getSchoolLogo();
    console.log("Logo length:", logoUrl.length);
    console.log("Logo prefix:", logoUrl.substring(0, 50));
}
main();
