// scripts/migrate-gallery-photos.mjs
// One-time migration: uploads Gallery1-37 static photos to Supabase Storage
// and seeds gallery_submissions rows for "BFF 1st Event".
//
// Pre-flight verified 2026-04-06:
//   - BFF 1st Event UUID: c9fb742c-6785-41f8-9598-687cb49554de ✅
//   - Dock Fishing: 9 rows ✅
//   - Fish Pics event inserted: 0815ded7-2eda-4f92-83c5-a13250975c80 ✅
//
// Run: SUPABASE_SERVICE_ROLE_KEY=<key> ADMIN_USER_ID=<kyle_uuid> node scripts/migrate-gallery-photos.mjs
//
// Requirements: node >= 18, @supabase/supabase-js installed

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://osiramhnynhwmlfyuqcp.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BFF_1ST_EVENT_ID = 'c9fb742c-6785-41f8-9598-687cb49554de';
const ADMIN_USER_ID = process.env.ADMIN_USER_ID; // Kyle: 1dcf9599-a7cf-43ab-856f-c1098e77e2d2

if (!SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
if (!ADMIN_USER_ID) throw new Error('Missing ADMIN_USER_ID');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const PHOTOS_DIR = path.resolve(__dirname, '../apps/web/public/Photos');
const BUCKET = 'gallery-public';

const PHOTOS = [
  { file: 'Gallery1.jpg',  caption: 'Club member tending a smoky charcoal grill at a BFF cookout event' },
  { file: 'Gallery2.jpg',  caption: 'Close-up of chicken and vegetables being grilled with tongs at a club gathering' },
  { file: 'Gallery3.jpg',  caption: 'Kids gathered at a picnic table with snacks at a Bayou Family Fishing club event' },
  { file: 'Gallery4.jpg',  caption: 'Club member in BFF shirt standing near stacked crab traps at the bayou dock' },
  { file: 'Gallery5.jpg',  caption: 'Club leader addressing a group of families outdoors near bayou homes' },
  { file: 'Gallery6.jpg',  caption: 'Adult crouching down to show a young girl something small at the waterfront' },
  { file: 'Gallery7.jpg',  caption: 'Young girl learning to tie a fishing knot with help from an adult volunteer' },
  { file: 'Gallery8.jpg',  caption: 'Club leader addressing a large group of families under Spanish moss trees at the bayou' },
  { file: 'Gallery9.jpg',  caption: 'Three men posing at the dock, one holding a Humminbird fish finder' },
  { file: 'Gallery10.jpg', caption: 'Group of girls and women posing together on a raised porch at the club property' },
  { file: 'Gallery11.jpg', caption: 'Three club members reviewing something on a phone together near the water' },
  { file: 'Gallery12.jpg', caption: 'Families boarding a white center console boat at the bayou dock' },
  { file: 'Gallery13.jpg', caption: 'Young child holding up their first fish catch at a BFF kids fishing day' },
  { file: 'Gallery14.jpg', caption: 'Whiteboard reading Basic Training Safety with Fishing Knots at Kids Fishing Club' },
  { file: 'Gallery15.jpg', caption: 'Instructor leading a hands-on fishing knots session at the BFF workshop' },
  { file: 'Gallery16.jpg', caption: 'Instructor teaching two girls fishing knots at the Kids Fishing Club whiteboard session' },
  { file: 'Gallery17.jpg', caption: 'Multiple participants practicing fishing knots with green line at a workbench' },
  { file: 'Gallery18.jpg', caption: 'Adults and children working together on fishing knot skills at the club workshop' },
  { file: 'Gallery19.jpg', caption: 'Families and volunteers practicing fishing knots together at an outdoor workshop table' },
  { file: 'Gallery20.jpg', caption: 'Child in HUK Performance Fishing shirt learning to tie a knot with a crimping tool' },
  { file: 'Gallery21.jpg', caption: 'Teen practicing a fishing knot with green line and guidance from an adult volunteer' },
  { file: 'Gallery22.jpg', caption: 'Two young BFF members proudly holding up a fish they caught together, landing net in hand' },
  { file: 'Gallery23.jpg', caption: 'Young BFF member in life jacket reacting with excitement after a surprise catch on the bayou' },
  { file: 'Gallery24.jpg', caption: 'Two BFF members showing off their large redfish catches out on the water' },
  { file: 'Gallery25.jpg', caption: 'Kids and a BFF volunteer posing on the dock after a successful fishing outing' },
  { file: 'Gallery26.jpg', caption: 'BFF member crouching on the shoreline, proudly showing off a large drum fish' },
  { file: 'Gallery27.jpg', caption: 'Three young BFF members grinning together out on the water for a club fishing day' },
  { file: 'Gallery28.jpg', caption: 'BFF member bundled up on the boat during a cool-weather day out on the bayou' },
  { file: 'Gallery29.jpg', caption: 'Two BFF members on the boat holding up a trophy-sized redfish catch' },
  { file: 'Gallery30.jpg', caption: 'BFF member at the dock crouching next to a large black drum fish after a successful trip' },
  { file: 'Gallery31.jpg', caption: 'A heaping tray of fresh Louisiana crawfish laid out for a BFF cookout gathering' },
  { file: 'Gallery32.jpg', caption: 'BFF member hauling a crab trap from the boat during a crabbing trip on the bayou' },
  { file: 'Gallery33.jpg', caption: 'Two young BFF members proudly showing off a trophy redfish they caught together' },
  { file: 'Gallery34.jpg', caption: 'BFF members out on the bayou together, lines in the water on a clear day' },
  { file: 'Gallery35.jpg', caption: 'The whole crew together after a memorable day out on the Louisiana bayou' },
  { file: 'Gallery36.jpg', caption: 'Two BFF members catching up at the marina after a day out on the water' },
  { file: 'Gallery37.jpg', caption: 'Young BFF member holding up a beautiful speckled trout caught on the Louisiana bayou' },
];

async function run() {
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const { file, caption } of PHOTOS) {
    const storagePath = `seed/${file}`;
    const filePath = path.join(PHOTOS_DIR, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`  WARN: ${file} not found at ${filePath}, skipping`);
      errors++;
      continue;
    }

    // Check if already uploaded (idempotent)
    const { data: existing } = await supabase
      .from('gallery_submissions')
      .select('id')
      .eq('storage_path', storagePath)
      .maybeSingle();

    if (existing) {
      console.log(`  SKIP: ${file} already in DB`);
      skipped++;
      continue;
    }

    // Upload to Storage
    const fileBuffer = fs.readFileSync(filePath);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError && uploadError.message !== 'The resource already exists') {
      console.error(`  ERROR uploading ${file}:`, uploadError.message);
      errors++;
      continue;
    }

    // Seed gallery_submissions row
    const { error: insertError } = await supabase
      .from('gallery_submissions')
      .insert({
        member_id: ADMIN_USER_ID,
        event_id: BFF_1ST_EVENT_ID,
        storage_path: storagePath,
        caption,
        status: 'approved',
      });

    if (insertError) {
      console.error(`  ERROR inserting ${file}:`, insertError.message);
      errors++;
      continue;
    }

    console.log(`  OK: ${file}`);
    uploaded++;
  }

  console.log(`\nDone. Uploaded: ${uploaded} | Skipped: ${skipped} | Errors: ${errors}`);
}

run().catch(console.error);
