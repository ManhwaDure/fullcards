import { MigrationInterface, QueryRunner } from "typeorm";

export class firstModel1652094473712 implements MigrationInterface {
    name = 'firstModel1652094473712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`card_content\` (\`id\` varchar(36) NOT NULL, \`parentId\` varchar(255) NULL, \`content\` text NOT NULL, \`withScrollDownText\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`REL_ea5dae2a8520cb420f07ec52c4\` (\`parentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`card_content_button\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`type\` enum ('gallery', 'anchor') NOT NULL, \`href\` varchar(255) NOT NULL, \`parentId\` varchar(255) NOT NULL, UNIQUE INDEX \`Alwayas_ordered\` (\`order\`, \`parentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`card_gallery_image\` (\`id\` varchar(36) NOT NULL, \`imageId\` varchar(255) NULL, \`parentId\` varchar(255) NULL, \`order\` int NOT NULL, UNIQUE INDEX \`Alwayas_ordered\` (\`order\`, \`parentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` varchar(36) NOT NULL, \`filename\` varchar(255) NOT NULL, \`filenameOnServer\` varchar(255) NOT NULL, \`filesize\` int NOT NULL, \`mimetype\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`card_background\` (\`id\` varchar(36) NOT NULL, \`parentId\` varchar(255) NULL, \`imageId\` varchar(255) NULL, \`css\` text NOT NULL DEFAULT '{}', \`defaultGradient\` tinyint NOT NULL, \`pseudoParallaxScrollingAnimation\` tinyint NOT NULL, \`pseudoParallaxScrollingAnimationDuration\` int NOT NULL DEFAULT '220', UNIQUE INDEX \`REL_dd31e1ac2f2937b6fd68ace77f\` (\`parentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`card_title\` (\`id\` varchar(36) NOT NULL, \`parentId\` varchar(255) NULL, \`content\` varchar(10000) NOT NULL, \`position\` enum ('center', 'bottomLeft', 'bottomRight', 'topLeft', 'topRight') NOT NULL DEFAULT 'topRight', UNIQUE INDEX \`REL_5d43babb5a8c38eda5c48fd10b\` (\`parentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`card\` (\`id\` varchar(36) NOT NULL, \`order\` int NOT NULL, \`titleId\` varchar(36) NULL, \`contentId\` varchar(36) NULL, \`backgroundId\` varchar(36) NULL, UNIQUE INDEX \`IDX_0d5dbb268f8776a841c7b06f05\` (\`order\`), UNIQUE INDEX \`REL_3bbecbd5128aa23dcb18633023\` (\`titleId\`), UNIQUE INDEX \`REL_1bf6280880eb9bf5c2de8599b5\` (\`contentId\`), UNIQUE INDEX \`REL_c2b5d5c97ea9418440d2cda00e\` (\`backgroundId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`site_setting\` (\`id\` varchar(255) NOT NULL, \`value\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`card_content\` ADD CONSTRAINT \`FK_ea5dae2a8520cb420f07ec52c44\` FOREIGN KEY (\`parentId\`) REFERENCES \`card\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_content_button\` ADD CONSTRAINT \`FK_d19e0e1a4530031a189a002afac\` FOREIGN KEY (\`parentId\`) REFERENCES \`card_content\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_gallery_image\` ADD CONSTRAINT \`FK_0e45d9df0ca4c33514a6acbcfe1\` FOREIGN KEY (\`imageId\`) REFERENCES \`image\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_gallery_image\` ADD CONSTRAINT \`FK_23af02fb3164351db745bf06de7\` FOREIGN KEY (\`parentId\`) REFERENCES \`card_content_button\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_background\` ADD CONSTRAINT \`FK_dd31e1ac2f2937b6fd68ace77fc\` FOREIGN KEY (\`parentId\`) REFERENCES \`card\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_background\` ADD CONSTRAINT \`FK_7450ae83e8fc6126a7b3d44ce5a\` FOREIGN KEY (\`imageId\`) REFERENCES \`image\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card_title\` ADD CONSTRAINT \`FK_5d43babb5a8c38eda5c48fd10b1\` FOREIGN KEY (\`parentId\`) REFERENCES \`card\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card\` ADD CONSTRAINT \`FK_3bbecbd5128aa23dcb186330232\` FOREIGN KEY (\`titleId\`) REFERENCES \`card_title\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card\` ADD CONSTRAINT \`FK_1bf6280880eb9bf5c2de8599b58\` FOREIGN KEY (\`contentId\`) REFERENCES \`card_content\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`card\` ADD CONSTRAINT \`FK_c2b5d5c97ea9418440d2cda00e9\` FOREIGN KEY (\`backgroundId\`) REFERENCES \`card_background\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`card\` DROP FOREIGN KEY \`FK_c2b5d5c97ea9418440d2cda00e9\``);
        await queryRunner.query(`ALTER TABLE \`card\` DROP FOREIGN KEY \`FK_1bf6280880eb9bf5c2de8599b58\``);
        await queryRunner.query(`ALTER TABLE \`card\` DROP FOREIGN KEY \`FK_3bbecbd5128aa23dcb186330232\``);
        await queryRunner.query(`ALTER TABLE \`card_title\` DROP FOREIGN KEY \`FK_5d43babb5a8c38eda5c48fd10b1\``);
        await queryRunner.query(`ALTER TABLE \`card_background\` DROP FOREIGN KEY \`FK_7450ae83e8fc6126a7b3d44ce5a\``);
        await queryRunner.query(`ALTER TABLE \`card_background\` DROP FOREIGN KEY \`FK_dd31e1ac2f2937b6fd68ace77fc\``);
        await queryRunner.query(`ALTER TABLE \`card_gallery_image\` DROP FOREIGN KEY \`FK_23af02fb3164351db745bf06de7\``);
        await queryRunner.query(`ALTER TABLE \`card_gallery_image\` DROP FOREIGN KEY \`FK_0e45d9df0ca4c33514a6acbcfe1\``);
        await queryRunner.query(`ALTER TABLE \`card_content_button\` DROP FOREIGN KEY \`FK_d19e0e1a4530031a189a002afac\``);
        await queryRunner.query(`ALTER TABLE \`card_content\` DROP FOREIGN KEY \`FK_ea5dae2a8520cb420f07ec52c44\``);
        await queryRunner.query(`DROP TABLE \`site_setting\``);
        await queryRunner.query(`DROP INDEX \`REL_c2b5d5c97ea9418440d2cda00e\` ON \`card\``);
        await queryRunner.query(`DROP INDEX \`REL_1bf6280880eb9bf5c2de8599b5\` ON \`card\``);
        await queryRunner.query(`DROP INDEX \`REL_3bbecbd5128aa23dcb18633023\` ON \`card\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d5dbb268f8776a841c7b06f05\` ON \`card\``);
        await queryRunner.query(`DROP TABLE \`card\``);
        await queryRunner.query(`DROP INDEX \`REL_5d43babb5a8c38eda5c48fd10b\` ON \`card_title\``);
        await queryRunner.query(`DROP TABLE \`card_title\``);
        await queryRunner.query(`DROP INDEX \`REL_dd31e1ac2f2937b6fd68ace77f\` ON \`card_background\``);
        await queryRunner.query(`DROP TABLE \`card_background\``);
        await queryRunner.query(`DROP TABLE \`image\``);
        await queryRunner.query(`DROP INDEX \`Alwayas_ordered\` ON \`card_gallery_image\``);
        await queryRunner.query(`DROP TABLE \`card_gallery_image\``);
        await queryRunner.query(`DROP INDEX \`Alwayas_ordered\` ON \`card_content_button\``);
        await queryRunner.query(`DROP TABLE \`card_content_button\``);
        await queryRunner.query(`DROP INDEX \`REL_ea5dae2a8520cb420f07ec52c4\` ON \`card_content\``);
        await queryRunner.query(`DROP TABLE \`card_content\``);
    }

}
