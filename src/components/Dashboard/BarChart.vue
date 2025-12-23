<template>
    <v-card elevation="3">
        <v-card-title class="text-subtitle-1">
            {{ title }}
        </v-card-title>

        <v-card-text>
            <canvas ref="canvas"></canvas>
        </v-card-text>
    </v-card>
</template>

<script>
    import {
        Chart,
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
    } from 'chart.js';

    Chart.register(
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
    );

    export default {
        name: 'BarChart',
        props: {
            title: String,
            labels: Array,
            data: Array
        },

        mounted() {
            this.renderChart();
        },

        methods: {
            renderChart() {
                new Chart(this.$refs.canvas, {
                    type: 'bar',
                    data: {
                        labels: this.labels,
                        datasets: [
                            {
                                label: this.title,
                                data: this.data,
                                backgroundColor: '#448AFF'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        }
    };
</script>

<style scoped>
    canvas {
        height: 500px !important;
    }
</style>
