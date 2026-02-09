import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, MapPin, Shield, Users, ChevronRight, Eye, EyeOff } from 'lucide-react';

type LoginMode = 'select' | 'officer' | 'citizen';

export function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (mode === 'officer') {
      navigate('/dashboard/live');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-2 gap-6 relative z-10">
        {/* Left Card - Chiang Mai Smart City Info */}
        <div className="relative bg-gradient-to-br from-blue-950/50 via-neutral-950/50 to-neutral-950/80 backdrop-blur-xl rounded-3xl p-10 text-white overflow-hidden border border-blue-900/30 shadow-2xl min-h-[520px] flex flex-col">
          {/* Decorative gradient blurs */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1763818693963-bac021e7b739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Chiang Mai night"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">CCTV Smart City</div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Chiang Mai
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Chiang Mai<br />Smart City
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-16">
              ระบบติดตามวิเคราะห์สำหรับการตรวจจับและบริหารจัดการ<br />
              การใช้รถใช้ถนนในเมืองเชียงใหม่
            </p>

            {/* Features at bottom */}
            <div className="space-y-3 mt-auto pt-8">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">ตรวจจับแบบเรียลไทม์</div>
                  <div className="text-xs text-gray-400">ระบบ AI ตรวจจับการฝ่าฝืนทันที</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">ปลอดภัยและเชื่อถือได้</div>
                  <div className="text-xs text-gray-400">ข้อมูลปลอดภัยและมาตรฐานสูง</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        </div>

        {/* Right Card - Login Options */}
        <div className="relative bg-neutral-950/80 backdrop-blur-xl rounded-3xl p-10 text-white border border-neutral-800/50 shadow-2xl min-h-[520px] flex flex-col">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2">ยินดีตอนรับ</h2>
          <p className="text-gray-400 text-sm mb-8">เลือกประเภทผู้ใช้งานเพื่อเข้าสู่ระบบ</p>

          {/* Selection Buttons */}
          <div className="space-y-3 mb-8">
            {/* Officer Dashboard Button */}
            <button
              onClick={() => setMode(mode === 'officer' ? 'select' : 'officer')}
              className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${
                mode === 'officer'
                  ? 'bg-blue-500/10 border-2 border-blue-500'
                  : 'bg-neutral-900/50 border-2 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                mode === 'officer' 
                  ? 'bg-blue-600 shadow-lg shadow-blue-600/30' 
                  : 'bg-neutral-800'
              }`}>
                <Shield className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Officer Dashboard</div>
                <div className="text-sm text-gray-400">สำหรับเจ้าหน้าที่ตำรวจ</div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-all ${
                mode === 'officer' ? 'text-blue-400' : 'text-gray-400'
              }`} />
            </button>

            {/* Citizen Portal Button */}
            <button
              onClick={() => navigate('/citizen')}
              className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all bg-neutral-900/50 border-2 border-neutral-800 hover:border-emerald-600 hover:bg-emerald-500/10 group"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all bg-neutral-800 group-hover:bg-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/30">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Citizen Portal</div>
                <div className="text-sm text-gray-400">สำหรับประชาชนทั่วไป</div>
              </div>
              <ChevronRight className="w-5 h-5 transition-all text-gray-400 group-hover:text-emerald-400" />
            </button>
          </div>

          {/* Login Form - Shows when mode is selected */}
          {mode !== 'select' && (
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-normal">อีเมล</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700/50 transition-all"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-normal">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-800 text-blue-600 focus:ring-blue-600/50"
                  />
                  <span className="text-sm text-gray-400 font-normal">จดจำฉันไว้</span>
                </label>
                <button className="text-sm text-blue-500 hover:text-blue-400 font-normal">
                  ลืมรหัสผ่าน?
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  mode === 'officer'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/30'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/30'
                }`}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-600">
            © 2026 Chiang Mai Smart City. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}