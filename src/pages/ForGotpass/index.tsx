import { useState } from 'react';

const ForgotPage = () => {
    const [Newpassword, setNewpassword] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    return ( 
        <>
        <div className=" h-screen w-screen flex">
            <div className=' bg-cover h-screen w-screen' style={{ backgroundImage: 'url("src/assets/Photo-by-Brooke-Cagle.png")', backgroundPosition: 'left' }}>
            </div>
            <div
                className="bg-white bg-opacity-20 bg-cover bg-center h-screen w-screen"
                style={{ backgroundImage: 'url("src/assets/Background.png")' }}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="max-w-md w-full">
                        <div className="bg-white shadow-md rounded-lg p-14 w-full max-w-md">
                            <div className="">
                                <img src="src/assets/logo.png" alt="Stroke Fast Track Logo" className="mx-auto w-fit h-fit" />
                            </div>
                            <div className=' bg-slate-50 shadow-sm rounded-lg p-2 border-b-gray-200 border'>
                                <form >
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            New Passwords
                                        </label>
                                        <input
                                            type="New Password"
                                            id="Password"
                                            value={Newpassword}
                                            onChange={(e) => setNewpassword(e.target.value)}
                                            placeholder="New Password"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="password" className=" block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 bg-gray-900 text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                                    >
                                        Changes
                                    </button>
                                </form>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() =>setIsSignUp(!isSignUp)}
                                    className="w-full py-2 px-4 bg-teal-400 text-white font-semibold rounded-md shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default ForgotPage;