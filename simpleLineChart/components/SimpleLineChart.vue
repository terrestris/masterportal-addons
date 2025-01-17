<script>
import LinechartItem from "../../../src/shared/modules/charts/components/LinechartItem.vue";
import dayjs from "dayjs";

export default {
    name: "SimpleLineChart",
    components: {
        LinechartItem
    },
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            config: undefined,
            stationData: undefined,
            linechartData: undefined,
            linechartDataOptions: {
                legend: {
                    display: false
                }
            }
        }
    },
    computed: {
    },
    watch: {
        stationData () {
            this.linechartData = this.createChartData(this.stationData.features);
        }
    },
    async mounted () {
        try {
            await this.initialize();
        }
        catch (error) {
            console.error(error);
        }
    },
    methods: {
        async initialize () {
            const config = this.feature.getTheme().params;
            this.config = config;
            const stationData = await this.getData(this.feature);
            this.stationData = stationData;
        },
        /**
         * Creates data object for line chart
         * @param {Array.<Object>} features - Features containing data to display in chart
         * @returns {Object} chart.js dataset
         */
        createChartData (features) {
            // cf. https://www.chartjs.org/docs/latest/samples/line/segments.html
            const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
            const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
            const dataPoints =
                features
                    .sort((a, b) => {
                        const aDate = dayjs(a.properties[this.config.wfs.attributes.timestamp]);
                        const bDate = dayjs(b.properties[this.config.wfs.attributes.timestamp]);

                        return aDate.isBefore(bDate) ? -1 : aDate.isAfter(bDate) ? 1 : 0;
                    })
                    .map(f => [
                        dayjs(f.properties[this.config.wfs.attributes.timestamp]).format("YYYY-MM"),
                        f.properties[this.config.wfs.attributes.value]
                    ]);
            return {
                labels: dataPoints.map(p => p[0]),
                datasets: [{
                label: this.feature.getTitle() || "",
                data: dataPoints.map(p => p[1]),
                borderColor: 'rgb(75, 192, 192)',
                segment: {
                    borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
                    borderDash: ctx => skipped(ctx, [6, 6]),
                },
                spanGaps: true
                }]
            };
        },
        /**
         * Fetch features from WFS
         * @param {Object} feature - Feature from Get Feature Info Request
         * @returns {Array.<Object>} Feature collection
         */
        async getData (feature) {
            try {
                const featureType = this.config.wfs.featureType;
                const wfsBaseUrl = this.config.wfs.url;
                const featureSDO = feature.getProperties().SDO_NAME;
                const url = new URL(wfsBaseUrl);

                url.searchParams.append("SERVICE", "WFS");
                url.searchParams.append("REQUEST", "GetFeature");
                url.searchParams.append("VERSION", "2.0.0");
                url.searchParams.append("TYPENAMES", featureType);
                url.searchParams.append("CQL_FILTER", `SDO_NAME='${featureSDO}'`);
                url.searchParams.append("OUTPUTFORMAT", "application/json");
                url.searchParams.append("propertyName", "SDO_GUID,ZEITSTEMPEL,ZEITINTERVALL,WERT,EINHEIT");
                url.searchParams.append("COUNT", 20);

                const response = await fetch(url.toString());

                return await response.json();
            } catch (error) {
                console.log(error);
                throw ("Error while fetching time series data for chart.");
            }
        }
    }
};

</script>

<template>
    <div id="simpleLineChart">
        <LinechartItem
                v-if="linechartData"
                :given-options="linechartDataOptions"
                :data="linechartData"
            />
    </div>
</template>
