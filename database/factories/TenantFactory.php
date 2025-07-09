<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate start time between 08:00 and 12:00 with only 00 and 30 minutes
        $startHour = fake()->numberBetween(8, 12);
        $startMinute = fake()->randomElement([0, 30]);
        $jamMulai = sprintf('%02d:%02d', $startHour, $startMinute);

        // Generate end time 8-10 hours after start time with only 00 and 30 minutes
        $durationHours = fake()->numberBetween(8, 10);
        $endDateTime = \DateTime::createFromFormat('H:i', $jamMulai);
        $endDateTime->add(new \DateInterval('PT' . $durationHours . 'H'));
        
        // Ensure end minute is either 00 or 30
        $endMinute = fake()->randomElement([0, 30]);
        $endDateTime->setTime($endDateTime->format('H'), $endMinute);
        $jamSelesai = $endDateTime->format('H:i');

        $nama = fake()->company();
        return [
            'nama' => $nama,
            'telepon' => fake()->unique()->phoneNumber(),
            'alamat' => fake()->address(),
            'qris' => "qris/1749864998_qris_code.jpeg",
            'jam_buka' => $jamMulai,
            'jam_tutup' => $jamSelesai,
            'tautan' => '/'.str_replace(' ', '-', strtolower($nama)),
            'user_id' => \App\Models\User::factory()->create()->id,
            'status' => 'aktif',
        ];
    }
}
