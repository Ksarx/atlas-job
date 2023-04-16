import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import { IChartDisciplines } from 'src/app/models/trajectory';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent {
  @Input('data') data: IChartDisciplines[] = [];
  @Input('trajectory') trajectory: string[] = [];
  @Output() similarityOut = new EventEmitter<number[]>();

  private jobName = 'Frontend разработчик';

  private width = 1184;
  private height = 1184;
  private svg: any;
  private color: any;
  private radius = Math.min(this.width, this.height) / 8;
  private similarity: number[] = [];

  ngOnInit(): void {
    this.createSvg();
    this.createColors(this.data);
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3
      .select('#donut')
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(data: any): void {
    let index = 0;
    const defaultColors = [
      '#665faac',
      '#dd8050c4',
      '#63adfeb3',
      '#24b044d9',
      '#ff516ed9',
      '#ffcf59ed',
      '#17a2b8',
    ];
    const colorsRange: string[] = [];
    this.data.forEach((element) => {
      if (element.color) colorsRange.push(element.color);
      else {
        colorsRange.push(defaultColors[index]);
        index++;
      }
    });
    this.color = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.percent.toString()))
      .range(colorsRange);
  }

  private drawChart(): void {
    var pie = d3
      .pie<any>()
      .sort(null)
      .value((d: any) => d.percent);

    var data_ready = pie(this.data);

    var arc = d3
      .arc()
      .innerRadius(this.radius * 0.7)
      .outerRadius(this.radius);

    var outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 4);

    // Фоновые круги
    this.svg
      .selectAll('blurCircles')
      .data(data_ready)
      .enter()
      .append('circle')
      .attr('r', 120)
      .attr('fill', (d: any) => this.color(d.data.percent))
      .style('z-index', -1)
      .style('filter', 'blur(80px)')
      .attr('transform', (d: any) => {
        const centroid = outerArc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      });

    // Пончик
    this.svg
      .selectAll('segments')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.color(d.data.percent))
      .style('opacity', 0.7);

    // Линии между сегментами
    let rad = this.radius;
    let coords: any[] = [];
    this.svg
      .selectAll('arcsSeparators')
      .data(data_ready)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('y2', function (d: any) {
        var angleStart = d.startAngle + 0.2;
        let xS = rad * 1 * Math.cos(angleStart - Math.PI / 2);
        let yS = rad * 0.8 * Math.sin(angleStart - Math.PI / 2);

        var angleEnd = d.endAngle - 0.1;
        let xE = rad * 1.3 * Math.cos(angleEnd - Math.PI / 2);
        let yE = rad * 1.3 * Math.sin(angleEnd - Math.PI / 2);

        const center = arc.centroid(d);
        let q;
        if (center[0] > 0 && center[1] < 0) {
          q = 'first-q';
        } else if (center[0] > 0 && center[1] > 0) {
          q = 'fourth-q';
        } else if (center[0] < 0 && center[1] > 0) {
          q = 'third-q';
        } else {
          q = 'second-q';
        }
        coords.push({
          xS: xS,
          yS: yS,
          xE: xE,
          yE: yE,
          lineX: Math.cos(d.startAngle - Math.PI / 2) * (rad - 50) * 6,
          lineY: Math.sin(d.startAngle - Math.PI / 2) * (rad - 50) * 6,
          quarter: q,
        });

        return Math.sin(d.startAngle - Math.PI / 2) * (rad - 50) * 6;
      })
      .attr('x2', function (d: any) {
        return Math.cos(d.startAngle - Math.PI / 2) * (rad - 50) * 6;
      })
      .attr('stroke', '#9E9E9E')
      .attr('stroke-width', 1);

    let htmlMeta = [];
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].quarter === 'first-q') {
        // 1 четверть
        var distance = Math.sqrt(
          Math.pow(coords[i + 1].lineX * 0.8 - coords[i].lineX * 0.8, 2) +
            Math.pow(coords[i + 1].yE * 0.8 - coords[i].lineY * 0.8, 2)
        );
        var width = distance;
        var height = distance;
        htmlMeta.push({
          x: coords[i].xS,
          y: coords[i].lineY,
          width: width > 592 ? 592 : width,
          height: height,
          quarter: 'first-q',
        });
      } else if (coords[i].quarter === 'second-q') {
        // 2 четверть
        let distance;
        if (i === coords.length - 1) {
          distance = Math.sqrt(
            Math.pow(coords[0].lineX * 0.8 - coords[i].xS * 0.8, 2) +
              Math.pow(coords[0].lineY * 0.8 - coords[i].yS * 0.8, 2)
          );
        } else {
          distance = Math.sqrt(
            Math.pow(coords[i + 1].lineX * 0.8 - coords[i].xS * 0.8, 2) +
              Math.pow(coords[i + 1].lineY * 0.8 - coords[i].yS * 0.8, 2)
          );
        }
        var width = distance;
        var height = distance;
        htmlMeta.push({
          x: coords[i].lineX * 0.9,
          y: i === coords.length - 1 ? coords[0].lineY : coords[i + 1].lineY,
          width: width > 592 ? 592 : width,
          height: height > 592 ? 592 : height,
          quarter: 'second-q',
        });
      } else if (coords[i].quarter === 'third-q') {
        // 3 четверть
        var distance = Math.sqrt(
          Math.pow(coords[i + 1].lineX * 0.8 - coords[i].lineX * 0.8, 2) +
            Math.pow(coords[i + 1].yE * 0.8 - coords[i].lineY * 0.8, 2)
        );
        var width = distance * 0.8;
        var height = distance;
        htmlMeta.push({
          x: coords[i + 1].lineX,
          y: coords[i].yE,
          width: width > 592 ? 592 : width,
          height: height > 592 ? 592 : height,
          quarter: 'third-q',
        });
      } else {
        // 4 четверть
        distance = Math.sqrt(
          Math.pow(coords[i + 1].lineX * 0.8 - coords[i].xS * 0.8, 2) +
            Math.pow(coords[i + 1].lineY * 0.8 - coords[i].yS * 0.8, 2)
        );
        var width = distance;
        var height = distance;
        htmlMeta.push({
          x: coords[i].xE,
          y: coords[i].yE,
          width: width > 592 ? 592 : width,
          height: height > 592 ? 592 : height,
          quarter: 'fourth-q',
        });
      }
    }

    htmlMeta.forEach((el, i, arr) => {
      const initList = '<div>';
      let sum = 0;

      let sumWithInit = this.data[i].disciplines.reduce((accum, curr) => {
        if (this.trajectory.includes(curr)) {
          sum++;
          return accum + `<div class="bold">${curr}</div>`;
        }
        return accum + `<div>${curr}</div>`;
      }, initList);

      this.similarity.push(
        Math.round((sum / this.data[i].disciplines.length) * 100)
      );
      sumWithInit += '</div>';

      this.svg
        .append('foreignObject')
        .attr('x', el.x)
        .attr('y', el.y)
        .attr('width', el.width)
        .attr('height', el.height)
        .html(sumWithInit)
        .classed('chart-disciplines', true)
        .classed(el.quarter, true);
    });
    this.sendSimilarity();

    // Круг, закрывающий линии, которые разделяют сегменты
    this.svg
      .append('svg:circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius * 0.7)
      .style('fill', '#fafafa')
      .append('g');

    // Профессия в центре
    this.svg
      .append('foreignObject')
      .attr('x', -100)
      .attr('y', -100)
      .attr('width', 200)
      .attr('height', 200)
      .html('<div>' + this.jobName + '</div>')
      .classed('job-name-chart', true);
  }

  sendSimilarity() {
    this.similarityOut.emit(this.similarity);
  }
}
