import * as migration_20260507_114916_init_collections from './20260507_114916_init_collections';
import * as migration_20260908_063440_add_quote_requests from './20260908_063440_add_quote_requests';
import * as migration_20260909_060107_add_testimonials from './20260909_060107_add_testimonials';
import * as migration_20260909_071240_website_content from './20260909_071240_website_content';
import * as migration_20260909_105712_about_video_and_testimonials_page from './20260909_105712_about_video_and_testimonials_page';
import * as migration_20260909_122552_project_proof_and_homepage_density from './20260909_122552_project_proof_and_homepage_density';
import * as migration_20260909_141551_video_transcript from './20260909_141551_video_transcript';
import * as migration_20260909_143953_remove_project_metrics from './20260909_143953_remove_project_metrics';
import * as migration_20260909_161958_project_gallery_media from './20260909_161958_project_gallery_media';
import * as migration_20260909_163300_remove_project_image_path from './20260909_163300_remove_project_image_path';
import * as migration_20260910_033012_external_writing_entries from './20260910_033012_external_writing_entries';
import * as migration_20260914_120000_generalize_contact_requests from './20260914_120000_generalize_contact_requests';
import * as migration_20260914_220000_navigation_branding_and_archive_intros from './20260914_220000_navigation_branding_and_archive_intros';

export const migrations = [
  {
    up: migration_20260507_114916_init_collections.up,
    down: migration_20260507_114916_init_collections.down,
    name: '20260507_114916_init_collections',
  },
  {
    up: migration_20260908_063440_add_quote_requests.up,
    down: migration_20260908_063440_add_quote_requests.down,
    name: '20260908_063440_add_quote_requests',
  },
  {
    up: migration_20260909_060107_add_testimonials.up,
    down: migration_20260909_060107_add_testimonials.down,
    name: '20260909_060107_add_testimonials',
  },
  {
    up: migration_20260909_071240_website_content.up,
    down: migration_20260909_071240_website_content.down,
    name: '20260909_071240_website_content',
  },
  {
    up: migration_20260909_105712_about_video_and_testimonials_page.up,
    down: migration_20260909_105712_about_video_and_testimonials_page.down,
    name: '20260909_105712_about_video_and_testimonials_page',
  },
  {
    up: migration_20260909_122552_project_proof_and_homepage_density.up,
    down: migration_20260909_122552_project_proof_and_homepage_density.down,
    name: '20260909_122552_project_proof_and_homepage_density',
  },
  {
    up: migration_20260909_141551_video_transcript.up,
    down: migration_20260909_141551_video_transcript.down,
    name: '20260909_141551_video_transcript',
  },
  {
    up: migration_20260909_143953_remove_project_metrics.up,
    down: migration_20260909_143953_remove_project_metrics.down,
    name: '20260909_143953_remove_project_metrics',
  },
  {
    up: migration_20260909_161958_project_gallery_media.up,
    down: migration_20260909_161958_project_gallery_media.down,
    name: '20260909_161958_project_gallery_media',
  },
  {
    up: migration_20260909_163300_remove_project_image_path.up,
    down: migration_20260909_163300_remove_project_image_path.down,
    name: '20260909_163300_remove_project_image_path',
  },
  {
    up: migration_20260910_033012_external_writing_entries.up,
    down: migration_20260910_033012_external_writing_entries.down,
    name: '20260910_033012_external_writing_entries',
  },
  {
    up: migration_20260914_120000_generalize_contact_requests.up,
    down: migration_20260914_120000_generalize_contact_requests.down,
    name: '20260914_120000_generalize_contact_requests',
  },
  {
    up: migration_20260914_220000_navigation_branding_and_archive_intros.up,
    down: migration_20260914_220000_navigation_branding_and_archive_intros.down,
    name: '20260914_220000_navigation_branding_and_archive_intros',
  },
];
