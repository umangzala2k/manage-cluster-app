import { useEffect, useState } from "react";
import InputField from '@/components/common/InputField';
import SelectField from "@/components/common/SelectField";
import HttpServices from "@/service/httpServices";

export default function EditSnapshotPolicyForm() {
    // Initialize HttpServices for API calls
    const httpServices = new HttpServices();

    // State variables for form management
    const [id, setId] = useState(null); // ID of the snapshot policy
    const [formError, setFormError] = useState(null); // Error message for form validation
    const [error, setError] = useState(null); // General error message
    const [loading, setLoading] = useState(false); // Loading state for async operations

    const [formData, setFormData] = useState({
        // Form data structure for snapshot policy
        policy_name: '',
        apply_to_directory: '',
        schedule_type: 'Daily or Weekly',
        timezone: 'America/Los_Angeles',
        snapshot_time: { hour: '', minute: '' },
        selectedDays: [],
        deleteSnapshot: 'never',
        autoDeleteDays: null,
        lock_snapshots: false,
        enable_policy: false,
    });

    useEffect(() => {
        // Fetch initial data for the form based on stored cluster ID
        const cluster = window.localStorage.getItem("cluster");
        if (cluster) {
            const parsedCluster = JSON.parse(cluster);
            if (parsedCluster.id) {
                setId(parsedCluster.id);
                fetchFormInitialData(parsedCluster.id);
            }
        }
    }, []);

    const fetchFormInitialData = async (id) => {
        try {
            setLoading(true); // Set loading state
            // Fetch snapshot policy data by ID
            const { data } = await httpServices.getClusterSnapPolicyById(id);
            // Destructure relevant data from the response
            const {
                policy_name,
                apply_to_directory,
                schedule_type,
                timezone,
                snapshot_time,
                days,
                delete_schedule,
                enable_policy,
                lock_snapshots
            } = data;

            // Process snapshot time and selected days
            const snapShotTime = snapshot_time.split(":");
            const selectedDays = Object.entries(days)
                .filter(([key, value]) => value)
                .map(([key]) => key);

            const isNeverDeleteSnapShot = Object.keys(delete_schedule).length === 0;

            // Update form data with fetched values
            setFormData((prev) => ({
                ...prev,
                policy_name,
                apply_to_directory,
                schedule_type,
                timezone,
                enable_policy,
                lock_snapshots,
                snapshot_time: {
                    hour: Number(snapShotTime[0]),
                    minute: Number(snapShotTime[1]),
                },
                selectedDays,
                deleteSnapshot: isNeverDeleteSnapShot ? "never" : "automatic",
                autoDeleteDays: isNeverDeleteSnapShot ? null : delete_schedule.days,
            }));
        } catch (formError) {
            // Improved error handling
            setError(formError?.response?.data?.message || 'Failed to fetch snapshot policy data. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleLockSnapshotChange = (e) => {
        // Handle changes to the lock snapshots checkbox
        setFormError(null);
        setFormData((prev) => ({
            ...prev,
            lock_snapshots: e.target.checked,
        }));
    };

    const handleEnablePolicy = (e) => {
        // Handle changes to the enable policy checkbox
        setFormError(null);
        setFormData((prev) => ({
            ...prev,
            enable_policy: e.target.checked,
        }));
    };

    const handleChange = (e) => {
        // Handle changes to form fields
        setFormError(null);
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prev) => {
                const selectedDays = checked
                    ? [...prev.selectedDays, value]
                    : prev.selectedDays.filter(day => day !== value);

                return {
                    ...prev,
                    selectedDays,
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const findEmptyOrNullKeys = (obj) => {
        // Find keys with empty or null values in the form data
        const keysWithEmptyValues = [];
        const checkValues = (currentObj, parentKey = '') => {
            Object.entries(currentObj).forEach(([key, value]) => {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;

                if (typeof value === 'object' && value !== null) {
                    checkValues(value, fullKey);
                } else if (value === '' || value === null) {
                    keysWithEmptyValues.push(fullKey);
                }
            });
        };

        checkValues(obj);
        return keysWithEmptyValues;
    };

    const handleSubmit = async (e) => {
        // Handle form submission
        try {
            setFormError(null);
            setLoading(true);
            e.preventDefault();

            // Validate auto delete days if deleteSnapshot is set to automatic
            if (formData.deleteSnapshot === 'automatic' && !formData.autoDeleteDays) {
                setFormError("Please enter days!");
                return;
            }

            // Check for empty fields in the form data
            const emptyVal = findEmptyOrNullKeys(formData);
            if (emptyVal.length) {
                setFormError(`Please enter ${emptyVal[0]}!`);
                return;
            }

            // Prepare payload for API call
            const {
                apply_to_directory,
                autoDeleteDays,
                deleteSnapshot,
                enable_policy,
                lock_snapshots,
                policy_name,
                schedule_type,
                selectedDays,
                snapshot_time,
                timezone,
            } = formData;

            const daysArray = [
                "everyday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ];

            const daysObject = daysArray.reduce((acc, day) => {
                acc[day] = selectedDays.includes(day);
                return acc;
            }, {});

            const preparePayload = {
                policy_name,
                apply_to_directory,
                schedule_type,
                timezone,
                snapshot_time: `${snapshot_time.hour}:${snapshot_time.minute}`,
                enable_policy,
                lock_snapshots,
                days: daysObject,
                delete_schedule: deleteSnapshot === 'never' ? deleteSnapshot : { option: "after", days: autoDeleteDays },
            };

            // Update snapshot policy via API
            await httpServices.updateClusterSnapPolicyById(id, { snapshot_policy: preparePayload });
            console.log('Updated Successfully!');
        } catch (error) {
            console.log('🌕: error', error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Days options for the form
    const days = [
        { id: 'everyday', title: "Every Day", value: "everyday" },
        { id: 'monday', title: "Mon", value: "monday" },
        { id: 'tuesday', title: "Tue", value: "tuesday" },
        { id: 'wednesday', title: "Wed", value: "wednesday" },
        { id: 'thursday', title: "Thur", value: "thursday" },
        { id: 'friday', title: "Fri", value: "friday" },
        { id: 'saturday', title: "Sat", value: "saturday" },
        { id: 'sunday', title: "Sun", value: "sunday" },
    ];

    // Display error message if any
    if (error) {
        return (<div className="mt-10 text-center text-3xl"> {error} </div>);
    }

    return (
        <form onSubmit={handleSubmit} aria-label="Edit Snapshot Policy Form">
            {/* Ensure accessibility with labels and roles */}
            <InputField label={"Policy Name"} name="policy_name" width={'w-9/12'} formData={formData} setFormData={setFormData} aria-required="true" />
            <InputField label={"Apply to Directory"} name="apply_to_directory" width={'w-9/12'} formData={formData} setFormData={setFormData} aria-required="true" />

            <div className="mb-4">
                <label>Run Policy on The Following Schedule</label>
                <div className="bg-primary-light border-t mt-2 py-8">
                    <div className="w-full flex mb-4 items-center">
                        <div className="w-1/4 text-end pr-4">
                            <label>Select Schedule Type</label>
                        </div>
                        <div className="w-3/4 pl-4">
                            <SelectField name="schedule_type" options={["Daily or Weekly", "Daily"]} formData={formData} setFormData={setFormData} />
                        </div>
                    </div>
                    <div className="w-full flex mb-4 items-center">
                        <div className="w-1/4 text-end pr-4">
                            <label>Set to Time Zone</label>
                        </div>
                        <div className="w-3/4 pl-4 flex items-center gap-2">
                            {formData.timezone}
                            <div className="size-4 bg-blue-600 rounded-full flex justify-center items-center">
                                <span className="text-sm text-black">?</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex mb-4 items-center">
                        <div className="w-1/4 text-end pr-4">
                            <label>Take a Snapshot at</label>
                        </div>
                        <div className="w-3/4 pl-4 flex items-center gap-2">
                            <InputField name="snapshot_time.hour" type="number" width="w-24" formData={formData} setFormData={setFormData} /> :
                            <InputField name="snapshot_time.minute" type="number" width="w-24" formData={formData} setFormData={setFormData} />
                        </div>
                    </div>
                    <div className="w-full flex mb-4 items-center">
                        <div className="w-1/4 text-end pr-4">
                            <label>On the Following Day(s)</label>
                        </div>
                        <div className="w-3/4 pl-4 flex items-center">
                            {days.map((day) => (
                                <div key={day.id} className="mr-6 flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        id={day.id}
                                        name="selectedDays"
                                        value={day.value}
                                        checked={formData.selectedDays.includes(day.value)}
                                        className="mr-1 size-4"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor={day.id}> {day.title} </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full flex mb-4 items-center">
                        <div className="w-1/4 text-end pr-4">
                            <label>Delete Each Snapshot</label>
                        </div>
                        <div className="w-3/4 pl-4 flex items-center">
                            <div className="mr-6 flex items-center gap-1">
                                <input
                                    type="radio"
                                    id="never"
                                    checked={formData.deleteSnapshot === 'never'}
                                    name="deleteSnapshot"
                                    value="never"
                                    className="mr-1 size-5"
                                    onChange={handleChange}
                                />
                                <label htmlFor="never"> Never </label>
                            </div>
                            <div className="mr-6 flex items-center gap-1">
                                <input
                                    type="radio"
                                    id="automatic"
                                    checked={formData.deleteSnapshot === 'automatic'}
                                    name="deleteSnapshot"
                                    value="automatic"
                                    className="mr-1 size-5"
                                    onChange={handleChange}
                                />
                                <label htmlFor="automatic"> Automatically after </label>
                                <InputField
                                    width="w-24"
                                    type="number"
                                    name="autoDeleteDays"
                                    formData={formData}
                                    disabled={formData.deleteSnapshot !== 'automatic'}
                                    setFormData={setFormData}
                                />
                                <SelectField
                                    width="w-25"
                                    options={["day(s)"]}
                                    name={"autoDeleteUnit"}
                                    formData={formData}
                                    disabled={formData.deleteSnapshot !== 'automatic'}
                                    setFormData={setFormData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <div className="text-lg mb-2">Snapshot Locking</div>
                <div className="mb-2">
                    Locked snapshots cannot be deleted before the deletion schedule expires. For this feature to be available, snapshots must be set to automatically delete.
                </div>
                <input
                    type="checkbox"
                    id="lock_snapshots"
                    name="lock_snapshots"
                    value={formData.lock_snapshots}
                    checked={!!formData.lock_snapshots}
                    className="mr-2 size-4"
                    disabled={formData.deleteSnapshot !== 'automatic'}
                    onChange={handleLockSnapshotChange}
                />
                <label htmlFor="lock_snapshots">Enable locked snapshots </label>
            </div>
            <div className="mb-4 mt-10">
                <input
                    type="checkbox"
                    id="enable_policy"
                    name="enable_policy"
                    checked={!!formData.enable_policy}
                    className="mr-2 size-4"
                    onChange={handleEnablePolicy}
                />
                <label htmlFor="enable_policy">Enable policy </label>
            </div>
            {formError && <div className="text-red-600">{formError}</div>}
            <button className="my-4 bg-secondary-light px-4 py-2 rounded-md mr-4" type="submit">
                {loading ? 'Loading...' : 'Save Policy'}
            </button>
            <button className="my-4 text-secondary-light">Cancel</button>
        </form>
    );
}
