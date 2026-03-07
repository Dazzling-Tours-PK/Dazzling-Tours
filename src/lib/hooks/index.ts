// Export all hooks from a single file for easy importing
export * from "./useBlogs";
export * from "./useTours";
export {
  useGetTourLocations,
  useGetTourDifficulties,
  useGetTourActivities,
  type TourLocation,
  type TourLocationsResponse,
  type TourDifficultyData,
  type TourDifficultiesResponse,
  type TourActivity,
  type TourActivitiesResponse,
} from "./useTours";
export * from "./useTestimonials";
export * from "./useComments";
export * from "./useContact";
export * from "./useDashboard";
export * from "./useCategories";
export * from "./useNotification";
export * from "./useGlobalError";
export * from "./useAuth";
export * from "./useForm";
export * from "./useDebounceValue";
export * from "./useAdminSeed";
