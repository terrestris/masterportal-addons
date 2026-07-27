<script>
import DefaultTheme from "@modules/getFeatureInfo/themes/default/components/DefaultTheme.vue";

export default {
    name: "IconTheme",
    extends: DefaultTheme,
    data: () => {
        return {
            icons: undefined,
            links: undefined
        };
    },
    methods: {
        /**
         * sets params from gfiTheme params
         * @param {Object} params the params to set
         * @returns {void}
         */
        initParams (params) {
            if (typeof params !== "object" || params === null) {
                return;
            }

            DefaultTheme.methods.initParams.call(this, params);
            this.icons = params?.iconMapping;
            this.links = params?.links;
        }
    }
};
</script>

<template>
    <div>
        <table
            v-if="mimeType !== 'text/html'"
            class="table table-hover"
        >
            <tbody v-if="mappedPropertiesExists(feature)">
                <tr v-if="!hasMappedProperties(feature)">
                    <td>
                        {{ $t("common:modules.getFeatureInfo.themes.default.noAttributeAvailable") }}
                    </td>
                </tr>
                <tr
                    v-for="(value, key) in getMappedPropertiesOfFeature(feature, showObjectKeysParam)"
                    v-else
                    :key="key"
                >
                    <td
                        class="font-bold firstCol"
                    >
                        <span v-if="icons && icons[key]">
                            <img
                                :src="icons[key]?.icon"
                                :alt="icons[key]?.aria"
                                :aria-label="icons[key]?.aria"
                                class="gfi-theme-icon"
                            >
                        </span>
                        <span v-else-if="beautifyKeysParam">
                            {{ beautifyKey(translateKeyWithPlausibilityCheck(key, v => $t(v))) }}
                        </span>
                        <span v-else>
                            {{ key }}
                        </span>
                    </td>
                    <td v-if="isWebLink(value) && !isImage(value)">
                        <a
                            :href="value"
                            target="_blank"
                        >Link</a>
                    </td>
                    <td v-else-if="isWebLink(value) && isImage(value)">
                        <a
                            :href="value"
                            target="_blank"
                        >
                            <img
                                class="gfi-theme-images-image"
                                :alt="$t('common:modules.getFeatureInfo.themes.default.imgAlt')"
                                :src="value"
                            >
                        </a>
                    </td>
                    <td v-else-if="isPhoneNumber(value)">
                        <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                    </td>
                    <td v-else-if="isEmailAddress(value)">
                        <a :href="`mailto:${value}`">{{ value }}</a>
                    </td>
                    <td
                        v-else-if="Array.isArray(value)"
                        v-html="value.join('<br>')"
                    />
                    <td v-else-if="hasPipe(value)">
                        <p
                            v-for="(splitValue, splitKey) in value.split('|')"
                            :key="splitKey"
                        >
                            {{ splitValue }}
                        </p>
                    </td>
                    <td
                        v-else-if="typeof value === 'string' && value.includes('<br>')"
                        v-html="value"
                    />
                    <td v-else>
                        {{ value }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="links" class="links-container">
            <span
                v-for="link in links"
                :key="link.name"
            >
                <a :href="link.url" target="_blank">{{ link.name }} <i class="bi bi-box-arrow-up-right"></i></a>
            </span>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@import "~variables";

.gfi-theme-images-image {
    margin: auto;
    display: block;
    text-align: center;
    color: $black;
    width: 100%;
}
.table {
    margin-bottom: 0;
    @include media-breakpoint-up(sm) {
        max-width: 400px;
    }
}
.gfi-theme-icon {
    width: 2rem;
}
.links-container {
    margin-top: 2rem;
}
</style>
