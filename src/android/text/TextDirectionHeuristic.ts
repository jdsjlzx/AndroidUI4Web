/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


module android.text {
/**
 * Interface for objects that use a heuristic for guessing at the paragraph direction by examining text.
 */
export interface TextDirectionHeuristic {

    /**
     * Guess if a {@code CharSequence} is in the RTL direction or not.
     *
     * @param cs the CharSequence.
     * @param start start index, inclusive.
     * @param count the length to check, must not be negative and not greater than
     *            {@code CharSequence.length() - start}.
     * @return true if all chars in the range are to be considered in a RTL direction,
     *          false otherwise.
     */
    isRtl(cs:string, start:number, count:number):boolean ;
}
}