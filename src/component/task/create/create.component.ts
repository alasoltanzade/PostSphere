import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PostService } from "../../../post.service";
import { UserStats } from "../../../model/user-stats.model";
import { Post } from "../../../model/post.model";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat, toLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Draw } from "ol/interaction";
import * as olProj from "ol/proj";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, AfterViewInit, OnDestroy {
  username: string = "";
  userStats: UserStats = {
    postCount: 0,
    followers: 0,
    following: 0,
  };
  postForm!: FormGroup;
  isLoading = false;

  map!: Map;
  vectorSource = new VectorSource();
  drawInteraction: Draw | null = null;

  selectedLocation: { lat: number | null; lng: number | null } = {
    lat: null,
    lng: null,
  };

  locationAvailable = false;
  locationError: string | null = null;
  locationLoading = false;

  constructor(private fb: FormBuilder, private postService: PostService) {}

  ngOnInit() {
    this.username = localStorage.getItem("username") || "";
    this.initForm();
    this.loadUserStats();
  }

  private initForm() {
    this.postForm = this.fb.group({
      instrument: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(6)]],
      year: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      latitude: [null],
      longitude: [null],
    });
  }

  getLocation() {
    console.log("درخواست موقعیت مکانی شروع شد");
    this.locationLoading = true;
    this.locationError = null;

    if (!navigator.geolocation) {
      console.error("مرورگر از geolocation پشتیبانی نمی‌کند");
      this.locationError =
        "مرورگر شما از دریافت موقعیت مکانی پشتیبانی نمی‌کند.";
      this.locationLoading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("موقعیت دریافت شد:", position);

        // اعتبارسنجی مختصات
        if (
          typeof position.coords.latitude !== "number" ||
          typeof position.coords.longitude !== "number"
        ) {
          throw new Error("مختصات نامعتبر دریافت شد");
        }

        console.log("عرض جغرافیایی:", position.coords.latitude);
        console.log("طول جغرافیایی:", position.coords.longitude);

        this.selectedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.postForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        this.showLocationOnMap(
          position.coords.longitude,
          position.coords.latitude
        );

        this.locationAvailable = true;
        this.locationLoading = false;
      },
      (error) => {
        console.error("جزئیات کامل خطا:", {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT,
        });

        this.locationLoading = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = "دسترسی به موقعیت مکانی توسط کاربر رد شد.";
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = `
            سرویس موقعیت‌یابی در دسترس نیست.
          `;
            break;
          case error.TIMEOUT:
            this.locationError =
              "دریافت موقعیت مکانی زمان‌بر شد. لطفاً دوباره تلاش کنید.";
            break;
          default:
            this.locationError = "خطای ناشناخته: " + error.message;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // 30 ثانیه
        maximumAge: 60000, // 1 دقیقه
      }
    );
  }

  // نمایش موقعیت روی نقشه
  private showLocationOnMap(lon: number, lat: number) {
    if (!this.map) return;

    const coordinate = fromLonLat([lon, lat]);

    this.vectorSource.clear();
    const feature = new Feature(new Point(coordinate));
    this.vectorSource.addFeature(feature);

    this.map.getView().setCenter(coordinate);
    this.map.getView().setZoom(15);
  }

  get instrumentControl(): AbstractControl {
    return this.postForm.get("instrument")!;
  }
  get descriptionControl(): AbstractControl {
    return this.postForm.get("description")!;
  }
  get yearControl(): AbstractControl {
    return this.postForm.get("year")!;
  }

  addPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const newPost: Post = {
      instrument: this.postForm.value.instrument,
      description: this.postForm.value.description,
      year: this.postForm.value.year,
      username: this.username,
      date: new Date().toISOString(),
      id: 0,
      name: "",
      latitude: this.selectedLocation.lat,
      longitude: this.selectedLocation.lng,
    };

    this.postService.createPost(newPost).subscribe({
      next: () => {
        this.postForm.reset();
        this.loadUserStats();
        this.isLoading = false;
        this.locationAvailable = false;
        this.selectedLocation = { lat: null, lng: null };
        this.vectorSource.clear(); // پاک کردن نقاط از نقشه
      },
      error: (err) => {
        console.error("Post creation failed!", err);
        this.isLoading = false;
      },
    });
  }

  loadUserStats() {
    this.postService.getUserStats(this.username).subscribe({
      next: (stats: UserStats) => {
        this.userStats = {
          postCount: stats.postCount ?? 0,
          followers: stats.followers ?? 0,
          following: stats.following ?? 0,
        };
      },
      error: (err) => {
        console.error("Failed to load user stats", err);
        this.resetUserStats();
      },
    });
  }

  private resetUserStats() {
    this.userStats = { postCount: 0, followers: 0, following: 0 };
  }

  ngAfterViewInit() {
    // استفاده از setTimeout برای اطمینان از وجود DOM
    setTimeout(() => this.initMap(), 0);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.dispose();
    }
  }

  private initMap() {
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: this.vectorSource,
        }),
      ],
      view: new View({
        center: fromLonLat([51.389, 35.6892]),
        zoom: 10,
      }),
    });

    this.addDrawInteraction();
  }

  private addDrawInteraction() {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
    }

    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: "Point",
    });

    this.drawInteraction.on("drawend", (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry() as Point;
      const coordinates = geometry.getCoordinates();
      const lonLat = this.toLonLat(coordinates);

      this.selectedLocation = {
        lng: lonLat[0],
        lat: lonLat[1],
      };

      this.postForm.patchValue({
        longitude: lonLat[0],
        latitude: lonLat[1],
      });

      this.locationAvailable = true;
    });

    this.map.addInteraction(this.drawInteraction);
  }

  private toLonLat(coordinates: number[]): number[] {
    if (!this.map) return [0, 0];

    return toLonLat(coordinates, this.map.getView().getProjection());
  }
}
